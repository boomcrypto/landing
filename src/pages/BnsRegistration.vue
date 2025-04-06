<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { ID } from 'appwrite';
import { account, databases } from '../lib/appwrite';
import { useStacksWallet, registerBnsName } from '../lib/stacksConnect';
import { fetchUserOwnedNames } from 'bns-v2-sdk';
import AppLayout from '../components/AppLayout.vue';

// Initialize the Stacks wallet composable
const { 
  isWalletConnected, 
  authenticate, 
  currentAddress, 
  disconnect,
  truncateAddress
} = useStacksWallet();

// Step tracking
const currentStep = ref(1);
const totalSteps = 3;

// Step 1 - Boom Account Registration
const email = ref<string>('');
const sending = ref(false);
const message = ref<string | null>(null);
const sent = ref(false);
const hasAccount = ref(false);

// Step 2 - Stacks Wallet Connection
const walletConnecting = ref(false);

// Step 3 - BNS Name Selection
const bnsNames = ref<{ name: string, originalName: string, available: boolean }[]>([]);
const selectedNames = ref<string[]>([]);
const searching = ref(false);
const fetchingBnsNames = ref(false);
const searchError = ref<string | null>(null);
const nameToAdd = ref('');
const userOwnedBtcNames = ref<string[]>([]);

// Progress tracking
const progress = computed(() => {
  return (currentStep.value / totalSteps) * 100;
});

// Check if user is already logged in and if wallet is connected
onMounted(async () => {
  try {
    // Check for existing Appwrite account
    try {
      const user = await account.get();
      if (user) {
        hasAccount.value = true;
        // If user is logged in, move to the next step
        currentStep.value = 2;
      }
    } catch (err) {
      // User not logged in with Appwrite, stay on step 1
      console.log('User not logged in with Appwrite');
    }
    
    // Check for wallet
    if (isWalletConnected) {
      console.log('Wallet already connected:', currentAddress);
      
      // If the wallet is connected and we have its address
      if (currentAddress) {
        // Update user record in database if account exists
        if (hasAccount.value) {
          await updateUserWallet(currentAddress);
          // Move to step 3 since we have both account and wallet
          currentStep.value = 3;
        }
      }
    }
  } catch (err) {
    console.error('Error during initialization:', err);
  }
});

// Step 1 function - Register for Boom
async function registerWithBoom() {
  if (!email.value) return;
  sending.value = true;

  try {
    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      message.value = 'Please enter a valid email address.';
      sending.value = false;
      return;
    }

    // Generate a unique user ID for the new user
    const userId = ID.unique();
    // The URL the user will be redirected to after clicking the link
    const redirectUrl = `${window.location.origin}/bns-verify`;

    await account.createMagicURLToken(userId, email.value, redirectUrl);
    
    // Store additional preferences if available
    try {
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID, 
        'bns_users',
        ID.unique(),
        {
          email: email.value,
          step: 1
        }
      );
    } catch (dbErr) {
      console.error('Failed to save user data:', dbErr);
    }
    
    message.value = 'Check your email for the verification link!';
    sent.value = true;
  } catch (err: any) {
    console.error(err);
    message.value = 'Failed to send verification link. Please try again.';
  } finally {
    sending.value = false;
  }
}

// Step 2 function - Connect to Stacks wallet
function handleConnectWallet() {
  walletConnecting.value = true;
  message.value = null;
  
  try {
    console.log("Initiating wallet connection...");
    
    // Call authenticate from our composable with a success callback
    authenticate(() => {
      console.log("Wallet connection callback triggered");
      console.log("Current address:", currentAddress);
      
      // We need to ensure there's an address before proceeding
      if (currentAddress) {
        console.log("Valid address found, updating database and moving to step 3");
        
        // Create a promise chain to ensure proper flow
        Promise.resolve()
          .then(() => updateUserWallet(currentAddress))
          .then(() => {
            console.log("Database updated, moving to step 3");
            
            // Force a state update in the next tick to ensure Vue reactivity
            setTimeout(() => {
              currentStep.value = 3;
              console.log("Current step updated to:", currentStep.value);
            }, 0);
          })
          .catch(err => {
            console.error("Error in wallet connect flow:", err);
            // Even if there was an error, still proceed to step 3
            currentStep.value = 3;
          });
      } else {
        console.log("No valid address found after authentication");
      }
    });
    
    // We won't know when the process completes with the popup-based flow,
    // so we'll reset the connecting state immediately
    walletConnecting.value = false;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    message.value = 'An error occurred while connecting to your wallet.';
    walletConnecting.value = false;
  }
}

// Function to update user with wallet address
async function updateUserWallet(address: string) {
  try {
    // Get the current user
    const currentUser = await account.get();
    
    if (currentUser) {
      // Try to find an existing record for this user
      try {
        const query = [
          `email=${currentUser.email}`
        ];
        
        const existingRecords = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          'bns_users',
          query
        );
        
        if (existingRecords.documents.length > 0) {
          // Update existing record
          const userDoc = existingRecords.documents[0];
          await databases.updateDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            'bns_users',
            userDoc.$id,
            {
              walletAddress: address,
              step: 2
            }
          );
        } else {
          // Create new record
          await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            'bns_users',
            ID.unique(),
            {
              email: currentUser.email,
              walletAddress: address,
              step: 2
            }
          );
        }
      } catch (dbErr) {
        console.error('Database operation failed:', dbErr);
        // If we can't update the database, still allow the user to continue
      }
    }
  } catch (error) {
    console.error('Error updating user wallet:', error);
  }
}

// Function to fetch BNS names owned by the user
async function fetchBnsNames() {
  if (!currentAddress) return;
  
  fetchingBnsNames.value = true;
  searchError.value = null;
  bnsNames.value = []; // Clear existing list
  userOwnedBtcNames.value = []; // Clear existing list
  
  try {
    console.log("Fetching BNS names for address:", currentAddress);
    
    // Fetch all names owned by the user
    const ownedNames = await fetchUserOwnedNames({
      senderAddress: currentAddress,
      network: "mainnet",
    });
    
    console.log("User owned names:", ownedNames);
    
    // Filter for only names in the 'btc' namespace
    const btcNames = ownedNames.filter(nameObj => nameObj.namespace === 'btc')
      .map(nameObj => `${nameObj.name}.${nameObj.namespace}`);
    
    userOwnedBtcNames.value = btcNames;
    
    console.log("BTC names:", btcNames);
    
    // For each .btc name, create a reservable .boom.btc name
    for (const btcName of btcNames) {
      // Get the name part without the .btc suffix
      const baseName = btcName.slice(0, -4); // remove .btc
      const boomName = `${baseName}.boom.btc`;
      
      // All names are available for reservation if the user owns the original
      bnsNames.value.push({
        name: boomName,
        originalName: btcName,
        available: true
      });
    }
    
    if (bnsNames.value.length === 0) {
      searchError.value = "You don't own any .btc names that can be reserved with .boom.btc";
    }
  } catch (error) {
    console.error('Error fetching BNS names:', error);
    searchError.value = 'Failed to fetch your BNS names. Please try again.';
  } finally {
    fetchingBnsNames.value = false;
  }
}

// Watch for wallet connection and fetch names when connected
watch(isWalletConnected, (newValue) => {
  if (newValue && currentStep.value === 3 && currentAddress) {
    fetchBnsNames();
  }
});

// Also watch current step to load names when arriving at step 3
watch(currentStep, (newValue) => {
  if (newValue === 3 && isWalletConnected.value && currentAddress) {
    fetchBnsNames();
  }
});

// Function to register the selected names
async function registerNames() {
  if (!currentAddress || selectedNames.value.length === 0) return;
  
  try {
    // Find the corresponding original BTC names for each selected boom.btc name
    const namesToRegister = selectedNames.value.map(selectedName => {
      const nameInfo = bnsNames.value.find(bn => bn.name === selectedName);
      return {
        boomName: selectedName,
        originalName: nameInfo ? nameInfo.originalName : null
      };
    }).filter(item => item.originalName !== null);
    
    console.log("Names to register:", namesToRegister);
    
    // Here you would integrate with registerBnsName from stacksConnect.ts
    // For each selected name
    for (const nameInfo of namesToRegister) {
      try {
        console.log(`Registering name: ${nameInfo.boomName} based on ${nameInfo.originalName} for address ${currentAddress}`);
        // In a production app, you would call:
        // await registerBnsName(nameInfo.boomName, currentAddress);
        
        // For demo purposes, we'll just log it
        // Simulate successful registration
        await new Promise(resolve => setTimeout(resolve, 500)); // Faster simulation for multiple names
        
        // Track the registration in the database
        await databases.createDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          'bns_registrations',
          ID.unique(),
          {
            boomName: nameInfo.boomName,
            originalName: nameInfo.originalName,
            address: currentAddress,
            status: 'pending',
            registeredAt: new Date().toISOString()
          }
        );
      } catch (err) {
        console.error(`Failed to register name: ${nameInfo.boomName}`, err);
        // Continue with other names
      }
    }
    
    // Show success message
    if (namesToRegister.length === 1) {
      alert(`Registration initiated for ${namesToRegister[0].boomName}. Please check your wallet to complete the transaction.`);
    } else {
      alert(`Registration initiated for ${namesToRegister.length} names. Please check your wallet to complete the transaction.`);
    }
    
    // Clear selected names after registration
    selectedNames.value = [];
  } catch (error) {
    console.error('Error registering names:', error);
    alert('There was an error initiating the registration. Please try again.');
  }
}

// Helper functions for navigation
function goToStep(step: number) {
  if (step < 1 || step > totalSteps) return;
  
  if (step > 1 && !hasAccount.value) {
    message.value = 'Please create an account first';
    return;
  }
  
  if (step > 2 && !isWalletConnected) {
    message.value = 'Please connect your wallet first';
    return;
  }
  
  currentStep.value = step;
}

function nextStep() {
  if (currentStep.value < totalSteps) {
    goToStep(currentStep.value + 1);
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    goToStep(currentStep.value - 1);
  }
}

// Function to disconnect wallet
function disconnectWallet() {
  disconnect();
}
</script>

<template>
  <AppLayout>
    <div class="min-h-screen">
      <!-- Header Section -->
      <section class="px-4 py-16">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Reserve Your Bitcoin Name</h1>
          <p class="text-xl mb-8">
            Secure your existing Bitcoin name on Boom's new Bitcoin namespace.
          </p>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-800 rounded-full h-2.5 mb-10 max-w-md mx-auto">
            <div class="bg-fuchsia-500 h-2.5 rounded-full" :style="{ width: `${progress}%` }"></div>
          </div>

          <!-- Steps Navigation -->
          <div class="flex justify-center gap-4 mb-10">
            <button @click="goToStep(1)" :class="[
                'w-8 h-8 rounded-full flex items-center justify-center', 
                currentStep >= 1 ? 'bg-fuchsia-500' : 'bg-gray-700',
                currentStep === 1 ? 'ring-2 ring-fuchsia-300' : ''
              ]">
              1
            </button>
            <div class="border-t border-gray-600 w-10 self-center"></div>
            <button @click="goToStep(2)" :class="[
                'w-8 h-8 rounded-full flex items-center justify-center', 
                currentStep >= 2 ? 'bg-fuchsia-500' : 'bg-gray-700',
                currentStep === 2 ? 'ring-2 ring-fuchsia-300' : '',
                !hasAccount ? 'opacity-50 cursor-not-allowed' : ''
              ]" :disabled="!hasAccount">
              2
            </button>
            <div class="border-t border-gray-600 w-10 self-center"></div>
            <button @click="goToStep(3)" :class="[
                'w-8 h-8 rounded-full flex items-center justify-center', 
                currentStep >= 3 ? 'bg-fuchsia-500' : 'bg-gray-700',
                currentStep === 3 ? 'ring-2 ring-fuchsia-300' : '',
                !isWalletConnected ? 'opacity-50 cursor-not-allowed' : ''
              ]" :disabled="!isWalletConnected">
              3
            </button>
          </div>
        </div>
      </section>

      <!-- Main Content Section -->
      <section class="px-4 pb-16">
        <div class="max-w-4xl mx-auto">

          <!-- Step 1: Register for Boom -->
          <div v-if="currentStep === 1" class="p-6 bg-gray-800 rounded-lg">
            <h2 class="text-2xl font-bold mb-4">Step 1: Create Your Boom Account</h2>
            <p class="mb-6">Before registering a BNS name, you need a Boom account. Enter your email to get started.</p>

            <div v-if="hasAccount">
              <div class="p-4 mb-6 bg-gray-700 rounded-lg">
                <p class="text-fuchsia-300 font-semibold">✓ Account already created</p>
                <p>You're already logged in and ready for the next step.</p>
              </div>
              <button @click="nextStep"
                class="w-full sm:w-auto px-6 py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 transition-colors">
                Continue to Next Step
              </button>
            </div>

            <div v-else-if="sent">
              <div class="p-4 mb-6 bg-gray-700 rounded-lg">
                <p class="text-fuchsia-300 font-semibold mb-2">✓ Email sent!</p>
                <p>{{ message }}</p>
              </div>
            </div>

            <div v-else>
              <div class="space-y-6">
                <div>
                  <label for="email" class="block text-sm font-medium mb-2">Email Address</label>
                  <input id="email" v-model="email" type="email" placeholder="Enter your email"
                    class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 outline-none"
                    :disabled="sending" @keyup.enter="registerWithBoom" />
                </div>

                <p v-if="message" class="text-red-400 text-sm">{{ message }}</p>

                <button :disabled="sending || !email"
                  class="w-full sm:w-auto px-6 py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  @click="registerWithBoom">
                  <span v-if="sending" class="flex items-center justify-center">
                    <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    Creating Account...
                  </span>
                  <span v-else>Create Account</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Step 2: Connect Stacks Wallet -->
          <div v-if="currentStep === 2" class="p-6 bg-gray-800 rounded-lg">
            <h2 class="text-2xl font-bold mb-4">Step 2: Connect Your Stacks Wallet</h2>
            <p class="mb-6">Connect your Stacks wallet to continue with the BNS registration process.</p>

            <div v-if="isWalletConnected" class="mb-6">
              <div class="p-4 bg-gray-700 rounded-lg">
                <p class="text-fuchsia-300 font-semibold mb-2">✓ Wallet Connected</p>
                <div class="flex items-center mt-2">
                  <span class="font-mono">{{ truncateAddress(currentAddress) }}</span>
                  <button
                    @click="disconnectWallet"
                    class="ml-3 p-1 rounded-full bg-gray-600 hover:bg-gray-500 text-white"
                  >
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="mt-6 flex space-x-4">
                <button @click="prevStep" class="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                  Previous Step
                </button>
                <button @click="nextStep"
                  class="px-6 py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 transition-colors">
                  Continue to Next Step
                </button>
              </div>
            </div>

            <div v-else class="mb-6">
              <div class="p-6 bg-gray-700 rounded-lg text-center mb-6">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 class="text-xl font-medium mb-2">Wallet Connection Required</h3>
                <p class="text-gray-300 mb-4">
                  You'll need to connect your Stacks wallet to register BNS names.
                  This allows you to sign transactions securely.
                </p>
                <p class="text-sm text-gray-400 mb-4">
                  Don't have a Stacks wallet? 
                  <a href="https://wallet.hiro.so" target="_blank" class="text-fuchsia-400 hover:underline">
                    Create one here
                  </a>
                </p>
              </div>

              <div class="flex space-x-4">
                <button @click="prevStep" class="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                  Previous Step
                </button>
                <button @click="handleConnectWallet" :disabled="walletConnecting"
                  class="flex-1 px-6 py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <span v-if="walletConnecting" class="flex items-center justify-center">
                    <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    Connecting...
                  </span>
                  <span v-else>Connect Wallet</span>
                </button>
              </div>

              <p v-if="message" class="mt-4 text-red-400 text-sm">{{ message }}</p>
            </div>
          </div>

          <!-- Step 3: BNS Name Selection -->
          <div v-if="currentStep === 3" class="p-6 bg-gray-800 rounded-lg">
            <h2 class="text-2xl font-bold mb-4">Step 3: Select BNS Names to Register</h2>
            <p class="mb-6">Choose the Bitcoin names you'd like to register. You can check availability and select
              multiple names.</p>

            <div class="mb-6">
              <div class="p-4 bg-gray-700 rounded-lg mb-6">
                <h3 class="font-semibold mb-2">Your Connected Wallet</h3>
                <div class="flex items-center mb-4">
                  <span class="font-mono">{{ truncateAddress(currentAddress) }}</span>
                  <button
                    @click="disconnectWallet"
                    class="ml-3 p-1 rounded-full bg-gray-600 hover:bg-gray-500 text-white"
                  >
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <h3 class="font-semibold mb-2">Your Reservable .boom.btc Names</h3>
                
                <div class="flex justify-between items-center mb-4">
                  <div v-if="fetchingBnsNames" class="flex items-center">
                    <svg class="animate-spin h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Fetching your BNS names...</span>
                  </div>
                  <button 
                    @click="fetchBnsNames"
                    :disabled="fetchingBnsNames"
                    class="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Names
                  </button>
                </div>
                
                <div v-if="searchError" class="p-3 bg-red-900/50 rounded-lg mb-4">
                  {{ searchError }}
                </div>
                
                <div v-if="!fetchingBnsNames && userOwnedBtcNames.length === 0" class="p-4 bg-gray-700 rounded-lg mb-4">
                  <p class="font-semibold mb-2">No .btc Names Found</p>
                  <p>You don't own any .btc names that can be reserved with .boom.btc.</p>
                  <p class="mt-2 text-sm text-gray-300">If you believe this is incorrect, please ensure your wallet is correctly connected and try refreshing the page.</p>
                </div>
                
                <div v-if="!fetchingBnsNames && userOwnedBtcNames.length > 0" class="p-4 bg-gray-700 rounded-lg mb-4">
                  <p class="font-semibold mb-2">{{ userOwnedBtcNames.length }} .btc Name{{ userOwnedBtcNames.length !== 1 ? 's' : '' }} Found</p>
                  <p>These are the .btc names you currently own, and their equivalent .boom.btc names you can reserve.</p>
                  <p class="mt-2 text-sm text-gray-300">Please select the names you wish to reserve.</p>
                </div>
                
                <div v-if="fetchingBnsNames" class="p-4 bg-gray-700 rounded-lg mb-4">
                  <p class="animate-pulse">Loading your reservable names...</p>
                </div>

                <div v-if="bnsNames.length > 0" class="mb-4">
                  <h3 class="font-semibold mb-2">Reservable Names</h3>
                  <div class="space-y-2">
                    <div v-for="(bnsName, index) in bnsNames" :key="index"
                      class="p-3 bg-gray-800 rounded-lg">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-mono text-fuchsia-300">{{ bnsName.name }}</span>
                          <span class="ml-2 text-green-500 text-sm">Reservable</span>
                          <span class="ml-2 text-fuchsia-300 text-xs font-medium">FREE</span>
                        </div>
                        <div class="flex items-center">
                          <button v-if="!selectedNames.includes(bnsName.name)"
                            @click="selectedNames.push(bnsName.name)"
                            class="px-3 py-1 bg-fuchsia-500 hover:bg-fuchsia-600 rounded">
                            Reserve
                          </button>
                          <button v-else
                            @click="selectedNames = selectedNames.filter(name => name !== bnsName.name)"
                            class="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded">
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <div class="mt-2 text-sm text-gray-400 flex items-center">
                        <span>Based on your ownership of:</span>
                        <span class="font-mono ml-2">{{ bnsName.originalName }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="selectedNames.length > 0" class="mb-4">
                  <h3 class="font-semibold mb-2">Selected Names ({{ selectedNames.length }})</h3>
                  <div class="p-3 bg-gray-800 rounded-lg">
                    <div class="flex flex-wrap gap-2">
                      <div v-for="(name, index) in selectedNames" :key="index"
                        class="px-3 py-1 bg-fuchsia-700 rounded-full flex items-center">
                        <span class="font-mono text-sm">{{ name }}</span>
                        <button @click="selectedNames = selectedNames.filter(n => n !== name)"
                          class="ml-2 h-5 w-5 rounded-full bg-fuchsia-800 hover:bg-fuchsia-900 flex items-center justify-center">
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex space-x-4">
                <button @click="prevStep" class="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                  Previous Step
                </button>
                <button @click="registerNames" :disabled="selectedNames.length === 0"
                  class="flex-1 px-6 py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Register {{ selectedNames.length }} Name{{ selectedNames.length !== 1 ? 's' : '' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="px-4 py-16 bg-gray-900">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold mb-12 text-center">Why Reserve Your Boom Bitcoin Name?</h2>

          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-gray-800 p-6 rounded-lg">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-500 mb-4">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">Extend your digital identity</h3>
              <p>Your BNS name serves as your digital identity across the Bitcoin ecosystem, making it easier for others
                to find and connect with you.</p>
            </div>

            <div class="bg-gray-800 p-6 rounded-lg">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-500 mb-4">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">Protect your brand</h3>
              <p>BNS names are secured by Bitcoin's blockchain, providing unparalleled security and true ownership of
                your digital namespace.</p>
            </div>

            <div class="bg-gray-800 p-6 rounded-lg">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-500 mb-4">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">Simplified Transactions</h3>
              <p>Replace complex wallet addresses with human-readable names for easier and error-free Bitcoin and Stacks
                transactions.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="px-4 py-16">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

          <div class="space-y-6">
            <div class="bg-gray-800 p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-2">What is Boom?</h3>
              <p>Boom is a Bitcoin social marketplace that brings together users and businesses</p>
            </div>
            <div class="bg-gray-800 p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-2">What is BNS?</h3>
              <p>Bitcoin Name System (BNS) is a decentralized naming protocol built on Bitcoin through Stacks. It allows
                you to register human-readable names that map to your blockchain addresses, similar to how DNS works for
                the internet.</p>
            </div>

            <div class="bg-gray-800 p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-2">How long do BNS names last?</h3>
              <p>BNS names are registered for a period of 1 year by default. You can renew your names before they expire
                to maintain ownership. Names that expire will become available for others to register.</p>
            </div>

            <div class="bg-gray-800 p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-2">How much does a BNS name cost?</h3>
              <p>The cost of a BNS name depends on its length. Shorter names generally cost more than longer names. The
                exact pricing will be displayed during the registration process.</p>
            </div>

            <div class="bg-gray-800 p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-2">Can I register multiple BNS names?</h3>
              <p>Yes, you can register as many BNS names as you want, provided they are available and you pay the
                registration fee for each name.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<style scoped>
/* Add any custom styling here */
</style>
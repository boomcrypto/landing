<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { ID } from 'appwrite';
import { account, databases } from '../lib/appwrite';
import { useStacksWallet, registerBnsName, fetchUserOwnedBtcNamesFromApi } from '../lib/stacksConnect';
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
    if (isWalletConnected.value) {
      console.log('Wallet already connected:', currentAddress.value);
      
      // If the wallet is connected and we have its address
      if (currentAddress.value) {
        // Update user record in database if account exists
        if (hasAccount.value) {
          await updateUserWallet(currentAddress.value);
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
      console.log("Current address value:", currentAddress.value);
      
      // We need to ensure there's an address before proceeding
      if (currentAddress && currentAddress.value) {
        console.log("Valid address found, updating database and moving to step 3");
        
        // Create a promise chain to ensure proper flow
        Promise.resolve()
          .then(() => updateUserWallet(currentAddress.value))
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
    console.log('current address: ', address);
    
    if (currentUser) {
      // Try to find an existing record for this user

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
    // Debug the actual address value, not the ref object
    console.log("Fetching BNS names for address value:", currentAddress.value);
    
    // Ensure we have a valid address
    if (!currentAddress || !currentAddress.value) return;
    
    // Fetch BTC names from the BNSv2 API directly - pass the actual string value
    const btcNames = await fetchUserOwnedBtcNamesFromApi(currentAddress.value);
    
    userOwnedBtcNames.value = btcNames;
    
    console.log("BTC names from BNSv2 API:", btcNames);
    
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
  // First update the UI state
  bnsNames.value = [];
  selectedNames.value = [];
  userOwnedBtcNames.value = [];
  currentStep.value = 2;
  
  // Then call the disconnect function which updates isWalletConnected
  disconnect();
  
  // Double-check that we're properly disconnected
  setTimeout(() => {
    if (isWalletConnected.value) {
      isWalletConnected.value = false;
      console.log('Forced wallet disconnection state');
    }
  }, 100);
}

// Helper function to copy an address to clipboard
function copyAddressToClipboard(address: string | null) {
  if (!address) return;
  
  navigator.clipboard.writeText(address)
    .then(() => {
      // Show a temporary toast or message
      alert('Address copied to clipboard');
    })
    .catch(err => {
      console.error('Could not copy text: ', err);
    });
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
            Secure your existing Bitcoin name on Boom's new Bitcoin namespace.<br />
            <span class="text-center text-fuchsia-500 font-semibold">
              .boom.btc
            </span>
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
                  <button @click="disconnectWallet"
                    class="ml-3 p-1 rounded-full bg-gray-600 hover:bg-gray-500 text-white">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
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

            <div v-if="!isWalletConnected" class="mb-6">
              <div class="p-6 bg-gray-700 rounded-lg text-center mb-6">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 class="text-xl font-medium mb-2">Wallet Connection Required</h3>
                <p class="text-gray-300 mb-4">
                  Your wallet appears to be disconnected. Please go back to Step 2 and connect your wallet.
                </p>
                <button @click="currentStep = 2"
                  class="px-6 py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 transition-colors">
                  Return to Step 2
                </button>
              </div>
            </div>

            <div v-else class="mb-6">
              <div class="p-4 bg-gray-700 rounded-lg mb-6">
                <h3 class="font-semibold mb-2">Your Connected Wallet</h3>
                <div
                  class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 bg-gray-800 rounded-lg mb-4">
                  <div class="flex items-center">
                    <span class="font-mono">{{ truncateAddress(currentAddress) }}</span>
                    <button @click="copyAddressToClipboard(currentAddress)"
                      class="ml-2 p-1 rounded-full bg-gray-700 hover:bg-gray-600 text-white" title="Copy address">
                      <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="handleConnectWallet"
                      class="px-3 py-1.5 rounded bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-sm flex items-center">
                      <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Connect Another
                    </button>
                    <button @click="disconnectWallet"
                      class="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm flex items-center">
                      <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Disconnect
                    </button>
                  </div>
                </div>

                <h3 class="font-semibold mb-2">Your Reservable .boom.btc Names</h3>

                <div class="flex justify-between items-center mb-4">
                  <div v-if="fetchingBnsNames" class="flex items-center">
                    <svg class="animate-spin h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    <span>Fetching your BNS names...</span>
                  </div>
                  <button @click="fetchBnsNames" :disabled="fetchingBnsNames"
                    class="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                    <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
                  <p class="mt-2 text-sm text-gray-300">If you believe this is incorrect, please ensure your wallet is
                    correctly connected and try refreshing the page.</p>
                </div>

                <div v-if="!fetchingBnsNames && userOwnedBtcNames.length > 0" class="p-4 bg-gray-700 rounded-lg mb-4">
                  <p class="font-semibold mb-2">{{ userOwnedBtcNames.length }} .btc Name{{ userOwnedBtcNames.length !==
                    1 ? 's' : '' }} Found</p>
                  <p>These are the .btc names you currently own, and their equivalent .boom.btc names you can reserve.
                  </p>
                  <p class="mt-2 text-sm text-gray-300">Please select the names you wish to reserve.</p>
                </div>

                <div v-if="fetchingBnsNames" class="p-4 bg-gray-700 rounded-lg mb-4">
                  <p class="animate-pulse">Loading your reservable names...</p>
                </div>

                <div v-if="bnsNames.length > 0" class="mb-4">
                  <h3 class="font-semibold mb-2">Reservable Names</h3>
                  <div class="space-y-2">
                    <div v-for="(bnsName, index) in bnsNames" :key="index" class="p-3 bg-gray-800 rounded-lg">
                      <div class="flex justify-between items-center">
                        <div>
                          <span class="font-mono text-fuchsia-300">{{ bnsName.name }}</span>
                          <span class="ml-2 text-green-500 text-sm">Reservable</span>
                          <span class="ml-2 text-fuchsia-300 text-xs font-medium">FREE</span>
                        </div>
                        <div class="flex items-center">
                          <button v-if="!selectedNames.includes(bnsName.name)" @click="selectedNames.push(bnsName.name)"
                            class="px-3 py-1 bg-fuchsia-500 hover:bg-fuchsia-600 rounded">
                            Reserve
                          </button>
                          <button v-else @click="selectedNames = selectedNames.filter(name => name !== bnsName.name)"
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
              <h3 class="text-xl font-bold mb-2">Community</h3>
              <p>Be part of a community of users focused to growing the Bitcoin economy.</p>
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
              <p>Maintain your digital identity across the Bitcoin ecosystem.</p>
            </div>

            <div class="bg-gray-800 p-6 rounded-lg">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="21">
                  <path
                    d="M2 16v3H0v2h16v-2h-2v-3a6 6 0 0 0-3.6-5.5A6 6 0 0 0 14 5V2h2V0H0v2h2v3a6 6 0 0 0 3.605 5.5A6 6 0 0 0 2 16zM4 3.918V2h8v1.918zM8 12a3.993 3.993 0 0 1 3.833 2.918H4.167A3.993 3.993 0 0 1 8 12z" fill="#fff" />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">Limited Reservation Window</h3>
              <p>Reserve now. At launch time, all unreserved names will be available to new users.</p>
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
              <h3 class="text-xl font-bold mb-2">Do I need to have a <span
                  class="text-center text-fuchsia-500 font-semibold">
                  .boom.btc
                </span>
                name to use Boom?</h3>
              <p>No. Your existing BNS name(s) will work just fine. This is a convenience offered to the existing BNS
                community.</p>
            </div>

            <div class="bg-gray-800 p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-2">How much does a <span
                  class="text-center text-fuchsia-500 font-semibold">
                  .boom.btc
                </span>
                name cost?</h3>
              <p> <span class="text-center text-fuchsia-500 font-semibold">
                  .boom.btc
                </span>
                names are free.</p>
            </div>

            <div class="bg-gray-800 p-6 rounded-lg">
              <h3 class="text-xl font-bold mb-2">I don't have a .btc name, can I still reserve a <span
                  class="text-center text-fuchsia-500 font-semibold">
                  .boom.btc
                </span>
                name?</h3>
              <p>Yes, but not at this time. This early reservation period is only for existing holders of .btc names</p>
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
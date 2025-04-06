<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { ID } from 'appwrite';
import { account, databases } from '../lib/appwrite';
import { 
  connectWallet, 
  getUserAddress, 
  hasStacksWallet,
  onAccountChange,
} from '../lib/stacksConnect';
import AppLayout from '../components/AppLayout.vue';

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
const walletConnected = ref(false);
const walletAddress = ref<string | null>(null);
const walletConnecting = ref(false);

// Step 3 - BNS Name Selection
const bnsNames = ref<{ name: string, available: boolean, price: number }[]>([]);
const selectedNames = ref<string[]>([]);
const searchQuery = ref('');
const searching = ref(false);
const searchError = ref<string | null>(null);
const nameToAdd = ref('');

// Progress tracking
const progress = computed(() => {
  return (currentStep.value / totalSteps) * 100;
});

// Set up wallet change listener
function handleAccountChange(event: AccountChangeEvent) {
  console.log('Account changed:', event);
  if (event.status === 'connected') {
    walletAddress.value = event.address;
    walletConnected.value = true;
  } else {
    walletAddress.value = null;
    walletConnected.value = false;
  }
}

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
    
    // Check for wallet provider
    if (hasStacksWallet()) {
      // Check for existing address
      try {
        const address = await getUserAddress();
        if (address) {
          walletAddress.value = address;
          walletConnected.value = true;
          
          // If we have both account and wallet, move to step 3
          if (hasAccount.value) {
            currentStep.value = 3;
          }
        }
      } catch (err) {
        console.log('Wallet not connected yet:', err);
      }
      
      // Set up account change listener
      onAccountChange(handleAccountChange);
    } else {
      console.log('No Stacks wallet provider found');
    }
  } catch (err) {
    console.error('Error during initialization:', err);
  }
});

// Clean up event listeners
onBeforeUnmount(() => {
  // Unfortunately with the current SIP-30, we can't directly remove the event listener
  // This would need to be done if the SIP-30 spec provides a method for this
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

// Step 2 function - Connect to Stacks wallet using SIP-30
async function handleConnectWallet() {
  walletConnecting.value = true;
  message.value = null;
  
  try {
    if (!hasStacksWallet()) {
      message.value = 'No Stacks wallet provider found. Please install a compatible wallet.';
      walletConnecting.value = false;
      return;
    }

    // Using SIP-30 connectWallet function to get addresses
    const addresses = await connectWallet();
    
    if (addresses && addresses.length > 0) {
      // Successfully connected
      walletAddress.value = addresses[0].address;
      walletConnected.value = true;
      
      // Update user record in database
      await updateUserWallet(addresses[0].address);
      
      // Move to next step
      currentStep.value = 3;
    } else {
      message.value = 'Could not connect to wallet. Please try again.';
    }
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    message.value = 'An error occurred while connecting to your wallet.';
  } finally {
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

// Function to check if a BNS name is available
async function checkNameAvailability(name: string) {
  if (!name) return;
  
  searching.value = true;
  searchError.value = null;
  
  try {
    // Validate name format
    if (!name.match(/^[a-z0-9_-]+$/)) {
      searchError.value = 'Names can only contain lowercase letters, numbers, hyphens, and underscores';
      searching.value = false;
      return;
    }
    
    // This would be a call to the BNS contract to check availability
    // For now, we'll simulate it with random availability
    
    // Check if name is already in the list
    const existing = bnsNames.value.find(n => n.name === name);
    if (existing) {
      searchError.value = 'This name is already in your list';
      searching.value = false;
      return;
    }
    
    // Simulate a network call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate pricing based on name length
    let price = 10; // Base price
    if (name.length <= 4) price = 100;
    else if (name.length <= 7) price = 50;
    else if (name.length <= 10) price = 25;
    
    // For this demo, make most names available with some randomness
    const available = Math.random() > 0.3;
    
    // Add the name to the list
    bnsNames.value.push({
      name,
      available,
      price
    });
    
    // Clear the input
    nameToAdd.value = '';
  } catch (error) {
    console.error('Error checking name availability:', error);
    searchError.value = 'Failed to check name availability';
  } finally {
    searching.value = false;
  }
}

// Function to register the selected names
async function registerNames() {
  if (!walletAddress.value || selectedNames.length === 0) return;
  
  try {
    // Here you would integrate with registerBnsName from stacksConnect.ts
    // For each selected name
    for (const name of selectedNames) {
      try {
        console.log(`Registering name: ${name} for address ${walletAddress.value}`);
        // In a production app, you would call:
        // await registerBnsName(name, walletAddress.value);
        
        // For demo purposes, we'll just log it
        // Simulate successful registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // You could update the database to track registered names
        await databases.createDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          'bns_registrations',
          ID.unique(),
          {
            name,
            address: walletAddress.value,
            status: 'pending',
            registeredAt: new Date().toISOString()
          }
        );
      } catch (err) {
        console.error(`Failed to register name: ${name}`, err);
        // Continue with other names
      }
    }
    
    // Show success message or redirect to a success page
    alert(`Registration initiated for ${selectedNames.length} name(s). Check your wallet to complete the transaction.`);
    
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
  
  if (step > 2 && !walletConnected.value) {
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
                !walletConnected ? 'opacity-50 cursor-not-allowed' : ''
              ]" :disabled="!walletConnected">
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

            <div v-if="walletConnected" class="mb-6">
              <div class="p-4 bg-gray-700 rounded-lg">
                <p class="text-fuchsia-300 font-semibold mb-2">✓ Wallet Connected</p>
                <p>Your wallet address: <span class="font-mono">{{ walletAddress }}</span></p>
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
                <p class="font-mono text-sm mb-4">{{ walletAddress }}</p>

                <h3 class="font-semibold mb-2">Search for BNS Names</h3>
                <div class="flex flex-col sm:flex-row gap-3 mb-4">
                  <input v-model="nameToAdd" type="text" placeholder="Enter a name to check"
                    class="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 outline-none" />
                  <button @click="checkNameAvailability(nameToAdd)" :disabled="searching || !nameToAdd"
                    class="px-4 py-2 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <span v-if="searching">Checking...</span>
                    <span v-else>Check Availability</span>
                  </button>
                </div>

                <div v-if="searchError" class="p-3 bg-red-900/50 rounded-lg mb-4">
                  {{ searchError }}
                </div>

                <div v-if="bnsNames.length > 0" class="mb-4">
                  <h3 class="font-semibold mb-2">Available Names</h3>
                  <div class="space-y-2">
                    <div v-for="(bnsName, index) in bnsNames" :key="index"
                      class="p-3 bg-gray-800 rounded-lg flex justify-between items-center">
                      <div>
                        <span class="font-mono">{{ bnsName.name }}</span>
                        <span v-if="bnsName.available" class="ml-2 text-green-500 text-sm">Available</span>
                        <span v-else class="ml-2 text-red-500 text-sm">Unavailable</span>
                      </div>
                      <div class="flex items-center">
                        <span class="text-sm mr-3">{{ bnsName.price }} STX</span>
                        <button v-if="bnsName.available && !selectedNames.includes(bnsName.name)"
                          @click="selectedNames.push(bnsName.name)"
                          class="px-3 py-1 bg-fuchsia-500 hover:bg-fuchsia-600 rounded">
                          Add
                        </button>
                        <button v-else-if="selectedNames.includes(bnsName.name)"
                          @click="selectedNames = selectedNames.filter(name => name !== bnsName.name)"
                          class="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded">
                          Remove
                        </button>
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
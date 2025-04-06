import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { ref, reactive, onMounted, onUnmounted } from 'vue';

// Create app config with needed scopes
const appConfig = new AppConfig(['store_write', 'publish_data']);

// Create a user session
const userSession = new UserSession({ appConfig });

// Define our network type
type Network = 'mainnet' | 'testnet';

// Define the return type for our composable
interface UseStacksWallet {
  isWalletOpen: boolean;
  isWalletConnected: boolean;
  testnetAddress: string | null;
  mainnetAddress: string | null;
  currentAddress: string | null;
  network: Network;
  setNetwork: (network: Network) => void;
  authenticate: (onSuccess?: () => void) => void;
  disconnect: () => void;
  truncateAddress: (address: string | null) => string;
  copyAddressToClipboard: () => void;
  didCopyAddress: boolean;
}

// Create a function to get the persisted network
function getPersistedNetwork(): Network {
  if (typeof window === 'undefined') return 'mainnet';
  const savedNetwork = localStorage.getItem('stacks-network');
  return (savedNetwork as Network) || 'mainnet';
}

// Create a function to persist the network
function persistNetwork(network: Network): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('stacks-network', network);
}

// Create our Vue composable
export function useStacksWallet(): UseStacksWallet {
  // State
  const isWalletOpen = ref(false);
  const isWalletConnected = ref(false);
  const network = ref<Network>(getPersistedNetwork());
  const didCopyAddress = ref(false);
  
  // Getters for addresses
  const testnetAddress = ref<string | null>(null);
  const mainnetAddress = ref<string | null>(null);
  
  // Computed value for current address based on network
  const currentAddress = ref<string | null>(null);
  
  // Initialize on mount
  onMounted(() => {
    // Check if user is already signed in
    if (userSession.isUserSignedIn()) {
      isWalletConnected.value = true;
      updateAddresses();
    }
  });
  
  // Helper to update address values
  function updateAddresses() {
    if (!isWalletConnected.value) {
      testnetAddress.value = null;
      mainnetAddress.value = null;
      currentAddress.value = null;
      return;
    }
    
    const userData = userSession.loadUserData();
    testnetAddress.value = userData.profile.stxAddress.testnet;
    mainnetAddress.value = userData.profile.stxAddress.mainnet;
    currentAddress.value = network.value === 'mainnet' ? mainnetAddress.value : testnetAddress.value;
  }
  
  // Function to set the network
  function setNetwork(newNetwork: Network) {
    network.value = newNetwork;
    persistNetwork(newNetwork);
    updateAddresses();
  }
  
  // Function to authenticate with callback
  function authenticate(onSuccess?: () => void) {
    if (!showConnect) {
      console.error("@stacks/connect isn't loaded properly");
      return;
    }
    
    console.log("Starting Stacks wallet authentication...");
    isWalletOpen.value = true;
    
    showConnect({
      appDetails: {
        name: 'Boom BNS Registration',
        icon: `${window.location.origin}/favicon.svg`,
      },
      redirectTo: '/bns-registration',
      onFinish: () => {
        console.log("Authentication finished, checking if signed in");
        isWalletOpen.value = false;
        const isSignedIn = userSession.isUserSignedIn();
        isWalletConnected.value = isSignedIn;
        updateAddresses();
        
        console.log("Is user signed in:", isSignedIn);
        console.log("Callback available:", !!onSuccess);
        
        // If the authentication was successful and a callback was provided, call it
        if (isSignedIn && onSuccess) {
          console.log("Executing onSuccess callback");
          setTimeout(() => {
            onSuccess();
          }, 100); // Small delay to ensure state is updated
        }
      },
      onCancel: () => {
        console.log("Authentication canceled");
        isWalletOpen.value = false;
      },
      userSession,
    });
  }
  
  // Function to disconnect
  function disconnect() {
    if (!userSession) return;
    userSession.signUserOut(window.location.toString());
    isWalletConnected.value = false;
    updateAddresses();
  }
  
  // Helper to truncate addresses for display
  function truncateAddress(address: string | null): string {
    if (!address) return '';
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  
  // Helper to copy address to clipboard
  function copyAddressToClipboard() {
    if (currentAddress.value) {
      navigator.clipboard.writeText(currentAddress.value);
      didCopyAddress.value = true;
      setTimeout(() => {
        didCopyAddress.value = false;
      }, 1000);
    }
  }
  
  // Return the composable with reactive references
  return {
    isWalletOpen,
    isWalletConnected,
    testnetAddress,
    mainnetAddress,
    currentAddress,
    network,
    setNetwork,
    authenticate,
    disconnect,
    truncateAddress,
    copyAddressToClipboard,
    didCopyAddress
  };
}

// Export the user session for direct use if needed
export { userSession };

// Contract call functions specifically for BNS
export async function callBnsContractFunction(
  contractAddress: string,
  contractName: string,
  functionName: string,
  functionArgs: any[]
) {
  // This would connect to the contract through @stacks/transactions
  // For a complete implementation, we would need additional dependencies
  console.log(`Calling BNS contract: ${contractAddress}.${contractName}::${functionName}`);
  console.log('Arguments:', functionArgs);
  
  // Return a placeholder for now
  return {
    txId: 'placeholder-transaction-id',
    status: 'submitted'
  };
}

// Function specifically for BNS name registration
export async function registerBnsName(
  name: string, 
  ownerAddress: string
) {
  // Example BNS registration - customize as needed for the specific BNS contract
  const contractAddress = 'SP000000000000000000002Q6VF78';  // Example, replace with actual BNS contract address
  const contractName = 'bns';
  const functionName = 'name-register';
  
  // Function arguments would depend on the specific BNS contract
  const functionArgs = [
    { type: 'string', value: name },
    { type: 'principal', value: ownerAddress }
  ];
  
  return callBnsContractFunction(contractAddress, contractName, functionName, functionArgs);
}
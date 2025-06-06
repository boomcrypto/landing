/**
 * @fileoverview Stacks wallet connection and BNS registration utilities
 * Currently used exclusively for BNS pre-launch registration functionality
 */

import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { ref, onMounted, type Ref } from 'vue';
import { databases } from './appwrite';
import { ID } from 'appwrite';

/** Create app config with needed scopes for BNS operations */
const appConfig = new AppConfig(['store_write', 'publish_data']);

/** Create a user session for Stacks wallet interaction */
const userSession = new UserSession({ appConfig });

/** Network type definition for Stacks blockchain */
type Network = 'mainnet' | 'testnet';

/**
 * Interface defining the return type for the useStacksWallet composable
 * Used for BNS pre-launch registration wallet connectivity
 */
interface UseStacksWallet {
  isWalletOpen: Ref<boolean>;
  isWalletConnected: Ref<boolean>;
  testnetAddress: Ref<string | null>;
  mainnetAddress: Ref<string | null>;
  currentAddress: Ref<string | null>;
  network: Ref<Network>;
  setNetwork: (network: Network) => void;
  authenticate: (onSuccess?: () => void) => void;
  disconnect: () => void;
  truncateAddress: (address: string | null) => string;
  copyAddressToClipboard: () => void;
  didCopyAddress: Ref<boolean>;
}

/**
 * Gets the persisted network selection from localStorage
 * @returns The saved network or 'mainnet' as default
 */
function getPersistedNetwork(): Network {
  if (typeof window === 'undefined') return 'mainnet';
  const savedNetwork = localStorage.getItem('stacks-network');
  return (savedNetwork as Network) || 'mainnet';
}

/**
 * Persists the network selection to localStorage
 * @param network - The network to persist
 */
function persistNetwork(network: Network): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('stacks-network', network);
}

/**
 * Vue composable for Stacks wallet connectivity and BNS operations
 * Currently used exclusively for BNS pre-launch registration
 * @returns Object containing wallet state and methods
 */
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
  
  /**
   * Updates address values based on current wallet connection state
   * Clears addresses if disconnected, loads from user data if connected
   */
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
  
  /**
   * Sets the network and persists the selection
   * @param newNetwork - The network to switch to
   */
  function setNetwork(newNetwork: Network) {
    network.value = newNetwork;
    persistNetwork(newNetwork);
    updateAddresses();
  }
  
  /**
   * Initiates Stacks wallet authentication for BNS registration
   * @param onSuccess - Optional callback to execute after successful authentication
   */
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
      redirectTo: '/reserve',
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
  
  /**
   * Disconnects the wallet and clears user session
   */
  function disconnect() {
    if (!userSession) return;
    userSession.signUserOut(window.location.toString());
    isWalletConnected.value = false;
    updateAddresses();
  }
  
  /**
   * Truncates Stacks addresses for display purposes
   * @param address - The address to truncate
   * @returns Truncated address string or empty string if null
   */
  function truncateAddress(address: string | null): string {
    if (!address) return '';
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  
  /**
   * Copies the current address to clipboard with feedback
   * Shows feedback for 1 second after copying
   */
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

/** Export the user session for direct use if needed */
export { userSession };

/**
 * Interface for BNSv2 API response structure
 * Used when fetching owned BTC names for BNS pre-launch registration
 */
interface BnsV2ApiResponse {
  total: number;
  current_burn_block: number;
  limit: number;
  offset: number;
  names: {
    full_name: string;
    name_string: string;
    namespace_string: string;
    owner: string;
    registered_at: string;
    renewal_height: string;
    stx_burn: string;
    revoked: boolean;
  }[];
}

/**
 * Fetches user-owned BTC names from BNSv2 API for pre-launch registration eligibility
 * @param stacksAddress - Stacks address (string, ref, or object with toString method)
 * @returns Promise resolving to array of owned .btc names
 */
export async function fetchUserOwnedBtcNamesFromApi(stacksAddress: string | Ref<string | null> | { toString(): string }): Promise<string[]> {
  try {
    // Handle if the address is a ref or a string
    let addressStr: string;
    
    if (typeof stacksAddress === 'object' && 'value' in stacksAddress) {
      // It's a ref
      if (!stacksAddress.value) {
        throw new Error('Address ref is null or undefined');
      }
      addressStr = String(stacksAddress.value);
    } else {
      // It's a regular value
      addressStr = String(stacksAddress);
    }
    
    console.log(`Fetching names for address ${addressStr} from BNSv2 API`);
    const response = await fetch(`https://api.bnsv2.com/names/address/${addressStr}/valid`);
    
    if (!response.ok) {
      throw new Error(`BNSv2 API response error: ${response.status} ${response.statusText}`);
    }
    
    const data: BnsV2ApiResponse = await response.json();
    console.log('BNSv2 API response:', data);
    
    // Filter names to only include .btc names and map to full names
    const btcNames = data.names
      .filter(name => name.namespace_string === 'btc')
      .map(name => name.full_name);
    
    console.log('Filtered .btc names:', btcNames);
    return btcNames;
  } catch (error) {
    console.error('Error fetching BTC names from BNSv2 API:', error);
    throw error;
  }
}

/**
 * Placeholder function for BNS contract interactions
 * Currently used for BNS pre-launch registration (placeholder implementation)
 * @param contractAddress - The contract address
 * @param contractName - The contract name
 * @param functionName - The function to call
 * @param functionArgs - Arguments to pass to the function
 * @returns Placeholder transaction object
 */
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

/**
 * Registers a BNS name for pre-launch registration
 * Stores registration data in Appwrite database
 * @param name - The BNS name to register
 * @param ownerAddress - The Stacks address of the owner
 * @returns Appwrite document creation response
 */
export async function registerBnsName(
  name: string, 
  ownerAddress: string
) {
  const res = await databases.createDocument(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    ID.unique(),
    {
      name,
      owner: ownerAddress,
    }
  )

  return res;
}
// SIP-30 Stacks Wallet Interface Implementation

// Type definitions for SIP-30
interface WalletProvider {
  request(method: string, params?: any[]): Promise<any>;
}

interface StxAddress {
  address: string;
  status: string;
  meta?: any;
}

export interface AccountChangeEvent {
  address: string;
  status: string;
}

// Check if wallet provider is available
export function hasStacksWallet(): boolean {
  return typeof window !== 'undefined' && 'WalletProvider' in window;
}

// Get the wallet provider
export function getStacksProvider(): WalletProvider | null {
  if (!hasStacksWallet()) return null;
  return (window as any).WalletProvider as WalletProvider;
}

// Check if user is connected already
export function isUserSignedIn(): boolean {
  // In SIP-30, there's no specific "signed in" state
  // We need to check if we can get addresses - handled in the component
  return hasStacksWallet();
}

// Connect to wallet (get addresses)
export async function connectWallet(): Promise<StxAddress[] | null> {
  try {
    const provider = getStacksProvider();
    if (!provider) {
      console.error('No Stacks wallet provider found');
      return null;
    }

    // This will trigger the wallet UI and prompt the user for permission
    const addresses = await provider.request('stx_getAddresses');
    return addresses;
  } catch (error) {
    console.error('Failed to connect to Stacks wallet:', error);
    return null;
  }
}

// Get the user's STX address
export async function getUserAddress(): Promise<string | null> {
  try {
    const addresses = await connectWallet();
    if (addresses && addresses.length > 0) {
      return addresses[0].address;
    }
    return null;
  } catch (error) {
    console.error('Failed to get user address:', error);
    return null;
  }
}

// Listen for account changes
export function onAccountChange(callback: (event: AccountChangeEvent) => void): void {
  if (!hasStacksWallet()) return;
  
  window.addEventListener('stx_accountChange', (event: any) => {
    if (event && event.detail) {
      callback(event.detail);
    }
  });
}

// Sign a message using the Stacks wallet
export async function signMessage(message: string): Promise<string | null> {
  try {
    const provider = getStacksProvider();
    if (!provider) {
      console.error('No Stacks wallet provider found');
      return null;
    }

    const result = await provider.request('stx_signMessage', [message]);
    return result.signature;
  } catch (error) {
    console.error('Failed to sign message:', error);
    return null;
  }
}

// Call a contract function
export async function callContract(
  contractAddress: string,
  contractName: string,
  functionName: string,
  functionArgs: any[]
): Promise<any> {
  try {
    const provider = getStacksProvider();
    if (!provider) {
      console.error('No Stacks wallet provider found');
      return null;
    }

    const txOptions = {
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network: 'mainnet', // or 'testnet'
    };

    const result = await provider.request('stx_signTransaction', [txOptions]);
    return result;
  } catch (error) {
    console.error('Failed to call contract:', error);
    throw error;
  }
}

// Function specifically for BNS registration
export async function registerBnsName(
  name: string, 
  ownerAddress: string
): Promise<any> {
  // Example BNS registration - customize as needed for the specific BNS contract
  const contractAddress = 'SP000000000000000000002Q6VF78';  // Example, replace with actual BNS contract address
  const contractName = 'bns';
  const functionName = 'name-register';
  
  // Function arguments would depend on the specific BNS contract
  const functionArgs = [
    { type: 'string', value: name },
    { type: 'principal', value: ownerAddress }
  ];
  
  return callContract(contractAddress, contractName, functionName, functionArgs);
}
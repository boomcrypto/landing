import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStacksWallet, fetchUserOwnedBtcNamesFromApi, callBnsContractFunction, registerBnsName } from '../../lib/stacksConnect';
import { nextTick } from 'vue';

// Mock the external libraries
vi.mock('@stacks/connect', () => {
  return {
    AppConfig: vi.fn().mockImplementation(() => ({})),
    UserSession: vi.fn().mockImplementation(() => ({
      isUserSignedIn: vi.fn().mockReturnValue(false),
      signUserOut: vi.fn(),
      loadUserData: vi.fn().mockReturnValue({
        profile: {
          stxAddress: {
            testnet: 'test-address-123',
            mainnet: 'main-address-456'
          }
        }
      })
    })),
    showConnect: vi.fn().mockImplementation((options) => {
      // Simulate successful authentication
      setTimeout(() => {
        if (options.onFinish) options.onFinish();
      }, 10);
    })
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Mock fetch
global.fetch = vi.fn();

describe('useStacksWallet', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should initialize with correct default values', () => {
    const wallet = useStacksWallet();
    
    expect(wallet.isWalletConnected.value).toBe(false);
    expect(wallet.currentAddress.value).toBe(null);
    expect(wallet.network.value).toBe('mainnet'); // Default network
    expect(wallet.testnetAddress.value).toBe(null);
    expect(wallet.mainnetAddress.value).toBe(null);
    expect(wallet.didCopyAddress.value).toBe(false);
  });

  it('should respect persisted network from localStorage', () => {
    localStorageMock.setItem('stacks-network', 'testnet');
    const wallet = useStacksWallet();
    
    expect(wallet.network.value).toBe('testnet');
  });

  it('should set network and persist it', () => {
    const wallet = useStacksWallet();
    wallet.setNetwork('testnet');
    
    expect(wallet.network.value).toBe('testnet');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('stacks-network', 'testnet');
  });

  it('should truncate addresses correctly', () => {
    const wallet = useStacksWallet();
    
    // Test short address
    expect(wallet.truncateAddress('abc')).toBe('abc');
    
    // Test long address
    expect(wallet.truncateAddress('0123456789abcdef')).toBe('012345...cdef');
    
    // Test null address
    expect(wallet.truncateAddress(null)).toBe('');
  });

  it('should authenticate and update state', async () => {
    // Mock UserSession.isUserSignedIn to return true after authentication
    const mockUserSession = vi.mocked(useStacksWallet().authenticate).mock.calls[0][0];
    vi.mock('@stacks/connect', () => ({
      ...vi.importActual('@stacks/connect'),
      UserSession: vi.fn().mockImplementation(() => ({
        isUserSignedIn: vi.fn().mockReturnValue(true),
        loadUserData: vi.fn().mockReturnValue({
          profile: {
            stxAddress: {
              testnet: 'test-address-123',
              mainnet: 'main-address-456'
            }
          }
        })
      }))
    }));
    
    const wallet = useStacksWallet();
    const mockCallback = vi.fn();
    wallet.authenticate(mockCallback);
    
    // Wait for the authentication process to complete
    await new Promise(resolve => setTimeout(resolve, 20));
    await nextTick();
    
    // The callback should have been called
    expect(mockCallback).toHaveBeenCalled();
    
    // State should be updated
    expect(wallet.isWalletOpen.value).toBe(false);
  });

  it('should disconnect and clear state', () => {
    const wallet = useStacksWallet();
    
    // Set initial connected state
    wallet.isWalletConnected.value = true;
    wallet.testnetAddress.value = 'test-address';
    wallet.mainnetAddress.value = 'main-address';
    wallet.currentAddress.value = 'current-address';
    
    // Disconnect
    wallet.disconnect();
    
    // State should be cleared
    expect(wallet.isWalletConnected.value).toBe(false);
    expect(wallet.testnetAddress.value).toBe(null);
    expect(wallet.mainnetAddress.value).toBe(null);
    expect(wallet.currentAddress.value).toBe(null);
  });

  it('should copy address to clipboard', () => {
    const wallet = useStacksWallet();
    
    // Mock clipboard and currentAddress
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });
    wallet.currentAddress.value = 'test-address';
    
    // Copy address
    wallet.copyAddressToClipboard();
    
    // Verify
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test-address');
    expect(wallet.didCopyAddress.value).toBe(true);
    
    // Wait for timeout
    vi.advanceTimersByTime(1100);
    expect(wallet.didCopyAddress.value).toBe(false);
  });
});

describe('fetchUserOwnedBtcNamesFromApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and filter BTC names successfully', async () => {
    // Mock successful API response
    const mockResponse = {
      total: 2,
      current_burn_block: 123456,
      limit: 50,
      offset: 0,
      names: [
        {
          full_name: 'test.btc',
          name_string: 'test',
          namespace_string: 'btc',
          owner: 'test-address-123',
          registered_at: '2023-01-01',
          renewal_height: '123456',
          stx_burn: '1000',
          revoked: false
        },
        {
          full_name: 'example.id',
          name_string: 'example',
          namespace_string: 'id',
          owner: 'test-address-123',
          registered_at: '2023-01-01',
          renewal_height: '123456',
          stx_burn: '1000',
          revoked: false
        }
      ]
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
    
    const result = await fetchUserOwnedBtcNamesFromApi('test-address-123');
    
    // Verify fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith('https://api.bnsv2.com/names/address/test-address-123/valid');
    
    // Verify result
    expect(result).toEqual(['test.btc']);
    expect(result.length).toBe(1);
  });

  it('should handle API errors', async () => {
    // Mock API error
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });
    
    // Verify error is thrown with correct message
    await expect(fetchUserOwnedBtcNamesFromApi('invalid-address'))
      .rejects
      .toThrow('BNSv2 API response error: 404 Not Found');
    
    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalledWith('https://api.bnsv2.com/names/address/invalid-address/valid');
  });

  it('should handle fetch errors', async () => {
    // Mock network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));
    
    // Verify error is thrown
    await expect(fetchUserOwnedBtcNamesFromApi('test-address-123'))
      .rejects
      .toThrow('Network failure');
  });

  it('should handle and convert non-string addresses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: 0, names: [] })
    });
    
    // Pass an object instead of a string
    const objAddress = { toString: () => 'converted-address' };
    await fetchUserOwnedBtcNamesFromApi(objAddress);
    
    // Verify fetch was called with correctly converted address
    expect(global.fetch).toHaveBeenCalledWith('https://api.bnsv2.com/names/address/converted-address/valid');
  });
});

describe('callBnsContractFunction', () => {
  it('should log contract call details and return placeholder', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    const result = await callBnsContractFunction(
      'contract-address',
      'contract-name',
      'function-name',
      ['arg1', 'arg2']
    );
    
    // Verify console logs
    expect(consoleSpy).toHaveBeenCalledWith('Calling BNS contract: contract-address.contract-name::function-name');
    expect(consoleSpy).toHaveBeenCalledWith('Arguments:', ['arg1', 'arg2']);
    
    // Verify placeholder result
    expect(result).toEqual({
      txId: 'placeholder-transaction-id',
      status: 'submitted'
    });
  });
});

describe('registerBnsName', () => {
  it('should call BNS contract with correct parameters', async () => {
    const callBnsContractFunctionSpy = vi.spyOn(global, 'callBnsContractFunction' as any);
    
    await registerBnsName('test.btc', 'owner-address');
    
    // Verify contract call
    expect(callBnsContractFunctionSpy).toHaveBeenCalledWith(
      'SP000000000000000000002Q6VF78',
      'bns',
      'name-register',
      [
        { type: 'string', value: 'test.btc' },
        { type: 'principal', value: 'owner-address' }
      ]
    );
  });
});
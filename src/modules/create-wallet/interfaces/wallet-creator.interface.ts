/**
 * Interface for wallet creation services
 * Defines the contract that all network-specific wallet creators must implement
 */
export interface WalletCreator {
  /**
   * Creates a new wallet for the specific network
   * @param mode - The network mode (mainnet or testnet)
   * @returns Promise containing wallet details (address, private key, mnemonic)
   */
  createWallet(mode?: 'mainnet' | 'testnet'): Promise<{
    address: string;
    key: string;
    mnemonic: string;
  }>;
}

/**
 * Base wallet creation result
 */
export interface WalletCreationResult {
  address: string;
  key: string;
  mnemonic: string;
}

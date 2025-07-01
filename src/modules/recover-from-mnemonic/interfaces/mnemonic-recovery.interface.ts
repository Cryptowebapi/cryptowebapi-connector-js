/**
 * Wallet Mnemonic Recovery Interface
 * 
 * Defines the contract for mnemonic-based wallet recovery services
 */

export interface MnemonicRecoveryResult {
  network: string;
  address: string;
  publicKey: string;
  privateKey: string;
  path: string;
}

/**
 * Interface for mnemonic-based wallet recovery services
 * Each blockchain network implements this interface to provide
 * consistent wallet recovery functionality from mnemonic phrases
 */
export interface MnemonicRecoveryInterface {
  /**
   * Derives a wallet address, public key, and private key from a BIP-39 mnemonic phrase
   * 
   * @param mnemonic - BIP-39 compliant mnemonic phrase
   * @param mode - Network mode (mainnet or testnet)
   * @returns Promise resolving to wallet recovery result
   * @throws Error if mnemonic is invalid or derivation fails
   */
  recoverFromMnemonic(
    mnemonic: string,
    mode?: 'mainnet' | 'testnet'
  ): Promise<MnemonicRecoveryResult>;
}

import { WalletCreator, WalletCreationResult } from '../interfaces/wallet-creator.interface.js';

/**
 * BNB (Binance Smart Chain) wallet creation service
 * Implements wallet generation for BNB network using ethers.js (EVM-compatible)
 */
export class BnbWalletService implements WalletCreator {
  
  /**
   * Creates a new BNB wallet
   * @param mode - Network mode (mainnet or testnet) - not used for BNB as address is same for both
   * @returns Promise containing wallet details
   */
  async createWallet(mode?: 'mainnet' | 'testnet'): Promise<WalletCreationResult> {
    try {
      // Dynamic import to avoid bundling ethers if not needed
      const ethers = await this.importEthers();
      
      // BNB Chain is EVM-compatible, so we can use the same approach as for Ethereum
      const wallet = ethers.Wallet.createRandom();

      // Extract wallet details
      const address = wallet.address;
      const key = wallet.privateKey.substring(2); // Remove '0x' prefix
      const mnemonic = wallet.mnemonic?.phrase || '';

      if (!mnemonic) {
        throw new Error('Failed to generate mnemonic for BNB wallet');
      }

      return {
        address,
        key,
        mnemonic,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create BNB wallet: ${errorMessage}`);
    }
  }

  /**
   * Dynamically import ethers to avoid bundling issues
   */
  private async importEthers(): Promise<any> {
    try {
      // @ts-ignore - Dynamic import to avoid TypeScript compile-time errors
      return await import('ethers');
    } catch (error) {
      throw new Error(
        'ethers package is required for BNB wallet creation. Please install it: npm install ethers'
      );
    }
  }
}

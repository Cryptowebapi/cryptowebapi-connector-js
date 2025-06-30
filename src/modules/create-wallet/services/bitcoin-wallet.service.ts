import { WalletCreator, WalletCreationResult } from '../interfaces/wallet-creator.interface';

/**
 * Bitcoin wallet creation service
 * Implements wallet generation for Bitcoin network using bitcoinjs-lib
 */
export class BitcoinWalletService implements WalletCreator {
  
  /**
   * Creates a new Bitcoin wallet
   * @param mode - Network mode (mainnet or testnet)
   * @returns Promise containing wallet details
   */
  async createWallet(mode: 'mainnet' | 'testnet' = 'mainnet'): Promise<WalletCreationResult> {
    try {
      // Dynamic imports to avoid bundling issues
      const [bitcoin, bip39, ecc, { ECPairFactory }] = await Promise.all([
        this.importBitcoin(),
        this.importBip39(),
        this.importEcc(),
        this.importECPair()
      ]);

      const ECPair = ECPairFactory(ecc);

      // Determine the network based on the mode
      const network = mode === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

      // Generate a random mnemonic
      const mnemonic = bip39.generateMnemonic();

      // Generate a random key pair
      const keyPair = ECPair.makeRandom({ network });

      // Get the private key
      const privateKey = keyPair.privateKey;
      if (!privateKey) {
        throw new Error('Failed to generate private key');
      }

      // Get the address using P2PKH (Pay to Public Key Hash)
      const { address } = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(keyPair.publicKey),
        network,
      });

      if (!address) {
        throw new Error('Failed to generate address');
      }

      return {
        address,
        key: Buffer.from(privateKey).toString('hex'),
        mnemonic,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create Bitcoin wallet: ${errorMessage}`);
    }
  }

  /**
   * Dynamically import bitcoinjs-lib
   */
  private async importBitcoin(): Promise<any> {
    try {
      // @ts-ignore - Dynamic import to avoid TypeScript compile-time errors
      return await import('bitcoinjs-lib');
    } catch (error) {
      throw new Error(
        'bitcoinjs-lib package is required for Bitcoin wallet creation. Please install it: npm install bitcoinjs-lib'
      );
    }
  }

  /**
   * Dynamically import bip39
   */
  private async importBip39(): Promise<any> {
    try {
      // @ts-ignore - Dynamic import to avoid TypeScript compile-time errors
      return await import('bip39');
    } catch (error) {
      throw new Error(
        'bip39 package is required for Bitcoin wallet creation. Please install it: npm install bip39'
      );
    }
  }

  /**
   * Dynamically import tiny-secp256k1
   */
  private async importEcc(): Promise<any> {
    try {
      // @ts-ignore - Dynamic import to avoid TypeScript compile-time errors
      return await import('tiny-secp256k1');
    } catch (error) {
      throw new Error(
        'tiny-secp256k1 package is required for Bitcoin wallet creation. Please install it: npm install tiny-secp256k1'
      );
    }
  }

  /**
   * Dynamically import ecpair
   */
  private async importECPair(): Promise<any> {
    try {
      // @ts-ignore - Dynamic import to avoid TypeScript compile-time errors
      return await import('ecpair');
    } catch (error) {
      throw new Error(
        'ecpair package is required for Bitcoin wallet creation. Please install it: npm install ecpair'
      );
    }
  }
}

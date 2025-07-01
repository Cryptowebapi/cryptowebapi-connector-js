import { MnemonicRecoveryInterface, MnemonicRecoveryResult } from '../interfaces/mnemonic-recovery.interface.js';

/**
 * BNB (Binance Smart Chain) Mnemonic Recovery Service
 * Implements wallet recovery from mnemonic for BNB network using ethers.js (EVM-compatible)
 */
export class BnbMnemonicService implements MnemonicRecoveryInterface {
  async recoverFromMnemonic(
    mnemonic: string,
    mode?: 'mainnet' | 'testnet'
  ): Promise<MnemonicRecoveryResult> {
    try {
      // Dynamically import ethers to avoid bundling issues
      const { HDNodeWallet, Mnemonic, SigningKey } = await Function('return import("ethers")')();

      // Define the HD path (BIP44 for BNB - same as Ethereum since it's EVM-compatible)
      const path = "m/44'/60'/0'/0/0";

      // Create a wallet from the mnemonic
      const mnemonicObj = Mnemonic.fromPhrase(mnemonic);
      const wallet = HDNodeWallet.fromMnemonic(mnemonicObj, path);

      // Get the address
      const address = wallet.address;

      // Get the private key (remove '0x' prefix)
      const privateKey = wallet.privateKey.slice(2);

      // Get the public key using SigningKey
      const signingKey = new SigningKey(wallet.privateKey);
      const publicKey = signingKey.compressedPublicKey.slice(2);

      return {
        network: 'bnb',
        address,
        publicKey,
        privateKey,
        path,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to recover BNB wallet: ${error.message}`);
      }
      throw new Error('Failed to recover BNB wallet');
    }
  }
}

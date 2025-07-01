import { MnemonicRecoveryInterface, MnemonicRecoveryResult } from '../interfaces/mnemonic-recovery.interface.js';

/**
 * Ethereum Mnemonic Recovery Service
 * Implements wallet recovery from mnemonic for Ethereum network
 */
export class EthereumMnemonicService implements MnemonicRecoveryInterface {
  async recoverFromMnemonic(
    mnemonic: string,
    mode?: 'mainnet' | 'testnet'
  ): Promise<MnemonicRecoveryResult> {
    // For Ethereum, the address is the same for mainnet and testnet
    void mode;

    try {
      // Dynamically import ethers to avoid bundling issues
      const { HDNodeWallet, Mnemonic, SigningKey } = await Function('return import("ethers")')();

      // Define the HD path (BIP44 for Ethereum)
      const path = "m/44'/60'/0'/0/0";

      // Create a wallet directly from the mnemonic and path
      const mnemonicObj = Mnemonic.fromPhrase(mnemonic);
      const wallet = HDNodeWallet.fromMnemonic(mnemonicObj, path);

      // Get the address
      const address = wallet.address;

      // Get the private key (remove '0x' prefix)
      const privateKey = wallet.privateKey.substring(2);

      // Get the public key
      const signingKey = new SigningKey(wallet.privateKey);
      const publicKey = signingKey.compressedPublicKey.substring(2);

      return {
        network: 'ethereum',
        address,
        publicKey,
        privateKey,
        path,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to recover Ethereum wallet: ${error.message}`);
      }
      throw new Error('Failed to recover Ethereum wallet');
    }
  }
}

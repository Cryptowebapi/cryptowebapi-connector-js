import { MnemonicRecoveryInterface, MnemonicRecoveryResult } from '../interfaces/mnemonic-recovery.interface.js';

/**
 * Bitcoin Mnemonic Recovery Service
 * Implements wallet recovery from mnemonic for Bitcoin network
 */
export class BitcoinMnemonicService implements MnemonicRecoveryInterface {
  async recoverFromMnemonic(
    mnemonic: string,
    mode: 'mainnet' | 'testnet' = 'mainnet'
  ): Promise<MnemonicRecoveryResult> {
    try {
      // Dynamically import bitcoin libraries to avoid bundling issues
      const [bitcoin, bip39, ecc, { BIP32Factory }] = await Promise.all([
        Function('return import("bitcoinjs-lib")')(),
        Function('return import("bip39")')(),
        Function('return import("tiny-secp256k1")')(),
        Function('return import("bip32")')()
      ]);

      // Initialize BIP32
      const bip32 = BIP32Factory(ecc);

      // Determine the network based on the mode
      const network = mode === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

      // Validate the mnemonic
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
      }

      // Convert mnemonic to seed
      const seed = await bip39.mnemonicToSeed(mnemonic);

      // Define the HD path (BIP44 for Bitcoin)
      const path = mode === 'testnet' ? "m/44'/1'/0'/0/0" : "m/44'/0'/0'/0/0";

      // Derive the HD wallet node
      const root = bip32.fromSeed(seed, network);
      const child = root.derivePath(path);

      // Get the private key
      const privateKey = child.privateKey;
      if (!privateKey) {
        throw new Error('Failed to derive private key');
      }

      // Get the public key
      const publicKey = child.publicKey;

      // Get the address
      const { address } = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(publicKey),
        network,
      });

      if (!address) {
        throw new Error('Failed to derive address');
      }

      return {
        network: 'bitcoin',
        address,
        publicKey: Buffer.from(publicKey).toString('hex'),
        privateKey: Buffer.from(privateKey).toString('hex'),
        path,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to recover Bitcoin wallet: ${error.message}`);
      }
      throw new Error('Failed to recover Bitcoin wallet');
    }
  }
}

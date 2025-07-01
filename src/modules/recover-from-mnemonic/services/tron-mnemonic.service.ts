import { MnemonicRecoveryInterface, MnemonicRecoveryResult } from '../interfaces/mnemonic-recovery.interface.js';
import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1';
import { BIP32Factory } from 'bip32';
import * as crypto from 'crypto';
import pkg from 'js-sha3';
const { keccak256 } = pkg;

// Initialize BIP32
const bip32 = BIP32Factory(ecc);

/**
 * TRON Mnemonic Recovery Service
 * Implements wallet recovery from mnemonic for TRON network
 */
export class TronMnemonicService implements MnemonicRecoveryInterface {
  // Base58 alphabet for Tron addresses
  private readonly BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  private base58Encode(buffer: Buffer): string {
    if (buffer.length === 0) return '';

    let digits = [0];
    for (let i = 0; i < buffer.length; i++) {
      let carry = buffer[i];
      for (let j = 0; j < digits.length; j++) {
        carry += digits[j] << 8;
        digits[j] = carry % 58;
        carry = (carry / 58) | 0;
      }
      while (carry) {
        digits.push(carry % 58);
        carry = (carry / 58) | 0;
      }
    }

    // Add leading zeros
    for (let i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
      digits.push(0);
    }

    return digits.reverse().map(digit => this.BASE58_ALPHABET[digit]).join('');
  }

  async recoverFromMnemonic(
    mnemonic: string,
    mode?: 'mainnet' | 'testnet'
  ): Promise<MnemonicRecoveryResult> {
    try {
      // Define the HD path (BIP44 for Tron)
      const path = "m/44'/195'/0'/0/0"; // BIP-44 → Tron

      /* ---------- 1. Validate input ---------- */
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
      }

      /* ---------- 2. Generate seed and derive keys ---------- */
      const seed = await bip39.mnemonicToSeed(mnemonic);
      const root = bip32.fromSeed(seed);
      const child = root.derivePath(path);

      // Get the private key
      const privateKey = child.privateKey;
      if (!privateKey) {
        throw new Error('Failed to derive private key');
      }

      // Get the public key
      const publicKey = child.publicKey;

      /* ---------- 3. Generate Tron address manually ---------- */
      // Convert private key to hex string format (Buffer to hex)
      const privateKeyHex = Buffer.from(privateKey).toString('hex');
      
      // Manual Tron address generation
      // Step 1: Get the public key from the private key
      const publicKeyPoint = ecc.pointFromScalar(privateKey, false);
      if (!publicKeyPoint) {
        throw new Error('Failed to derive public key point');
      }
      
      // Step 2: Remove the first byte (0x04) from uncompressed public key
      const publicKeyBytes = publicKeyPoint.slice(1);
      
      // Step 3: Hash the public key with Keccak-256
      const publicKeyHash = Buffer.from(keccak256(publicKeyBytes), 'hex');
      
      // Step 4: Take the last 20 bytes and add Tron prefix (0x41)
      const addressBytes = Buffer.concat([Buffer.from([0x41]), publicKeyHash.slice(-20)]);
      
      // Step 5: Double SHA-256 for checksum
      const hash1 = crypto.createHash('sha256').update(addressBytes).digest();
      const hash2 = crypto.createHash('sha256').update(hash1).digest();
      const checksum = hash2.slice(0, 4);
      
      // Step 6: Concatenate address and checksum
      const fullAddress = Buffer.concat([addressBytes, checksum]);
      
      // Step 7: Base58 encode
      const address = this.base58Encode(fullAddress);

      return {
        network: 'tron',
        address,
        publicKey: Buffer.from(publicKey).toString('hex'),
        privateKey: privateKeyHex,
        path,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Failed to derive Tron address: ${msg}`);
    }
  }
}

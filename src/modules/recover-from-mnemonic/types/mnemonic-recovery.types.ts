/**
 * Recover From Mnemonic Types
 * 
 * Defines the types used for mnemonic-based wallet recovery
 */

import { SupportedNetwork } from '../../../types.js';

/**
 * Supported networks for mnemonic recovery
 */
export type SupportedNetworks = SupportedNetwork;

/**
 * Options for recovering a wallet from mnemonic
 */
export interface MnemonicRecoveryOptions {
  mode?: 'mainnet' | 'testnet';
}

/**
 * Result of wallet recovery from mnemonic
 */
export interface MnemonicRecoveryResult {
  network: string;
  address: string;
  publicKey: string;
  privateKey: string;
  path: string;
}

/**
 * Recovery mode type
 */
export type RecoveryMode = 'mainnet' | 'testnet';

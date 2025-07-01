/**
 * Transaction Builder Types
 * 
 * Defines the types and interfaces used for building blockchain transactions
 */

import { SupportedNetwork } from '../../../types';

/**
 * Options for building a transaction
 */
export interface BuildTransactionOptions {
  network: SupportedNetwork;
  privateKey: string;
  receiver: string;
  value: number | string;
  mode?: 'mainnet' | 'testnet';
  contractAddress?: string;
  contractDecimal?: number;
  nonce?: number;
  gasPrice?: string;
  gasLimit?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

/**
 * Result of a built transaction
 */
export interface BuildTransactionResult {
  network: SupportedNetwork;
  from: string;
  to: string;
  value: string;
  rawTx: string;
  gasPrice: string;
  gasLimit: string;
  estimatedFeeEth: string;
  nonce: string;
  chainId: string;
  type: 'native' | 'erc20' | 'bep20';
}

/**
 * Transaction build modes
 */
export type TransactionMode = 'mainnet' | 'testnet';

/**
 * Transaction types
 */
export type TransactionType = 'native' | 'erc20' | 'bep20' | 'bitcoin' | 'tron';

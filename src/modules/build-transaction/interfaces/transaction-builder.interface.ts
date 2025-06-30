/**
 * Transaction Builder Interface
 * 
 * Defines the contract for transaction building services
 */

import { BuildTransactionOptions, BuildTransactionResult } from '../types/transaction-builder.types';

/**
 * Interface for transaction building services
 */
export interface ITransactionBuilder {
  /**
   * Build and sign a transaction
   * 
   * @param options - Transaction building options
   * @returns Promise containing the built transaction details
   */
  buildTransaction(options: BuildTransactionOptions): Promise<BuildTransactionResult>;

  /**
   * Get the supported network for this builder
   * 
   * @returns The network this builder supports
   */
  getSupportedNetwork(): string;

  /**
   * Check if the required dependencies are available
   * 
   * @returns True if dependencies are available, false otherwise
   */
  isDependencyAvailable(): Promise<boolean>;
}

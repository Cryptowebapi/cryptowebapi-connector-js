/**
 * Transaction Builder Factory
 * 
 * Factory class for creating network-specific transaction builders
 */

import { SupportedNetwork } from '../../../types';
import { ITransactionBuilder } from '../interfaces/transaction-builder.interface';
import {
  EthereumTransactionService,
  BnbTransactionService,
  BitcoinTransactionService,
  TronTransactionService,
} from '../services';

export class TransactionBuilderFactory {
  private services: Map<SupportedNetwork, ITransactionBuilder> = new Map();

  constructor() {
    this.initializeServices();
  }

  /**
   * Initialize all transaction building services
   */
  private initializeServices(): void {
    this.services.set('ethereum', new EthereumTransactionService());
    this.services.set('bnb', new BnbTransactionService());
    this.services.set('bitcoin', new BitcoinTransactionService());
    this.services.set('tron', new TronTransactionService());
  }

  /**
   * Get a transaction builder service for a specific network
   * 
   * @param network - The blockchain network
   * @returns Promise<ITransactionBuilder> - The transaction builder service
   */
  async getService(network: SupportedNetwork): Promise<ITransactionBuilder> {
    const service = this.services.get(network);
    
    if (!service) {
      throw new Error(`Transaction builder for network '${network}' is not supported`);
    }

    // Check if dependencies are available
    const isAvailable = await service.isDependencyAvailable();
    if (!isAvailable) {
      const dependencyMessage = this.getDependencyMessage(network);
      throw new Error(
        `Required dependencies for ${network} transaction building are not installed. ${dependencyMessage}`
      );
    }

    return service;
  }

  /**
   * Get dependency installation message for a network
   */
  private getDependencyMessage(network: SupportedNetwork): string {
    switch (network) {
      case 'ethereum':
      case 'bnb':
        return 'Please install: npm install ethers';
      case 'bitcoin':
        return 'Please install: npm install bitcoinjs-lib bip39 tiny-secp256k1 ecpair';
      case 'tron':
        return 'Please install: npm install ethers bip39';
      default:
        return 'Please install the required dependencies for this network';
    }
  }

  /**
   * Get all supported networks
   * 
   * @returns Array of supported network names
   */
  getSupportedNetworks(): SupportedNetwork[] {
    return Array.from(this.services.keys());
  }

  /**
   * Check if a network is supported
   * 
   * @param network - The network to check
   * @returns True if the network is supported
   */
  isNetworkSupported(network: string): network is SupportedNetwork {
    return this.services.has(network as SupportedNetwork);
  }
}

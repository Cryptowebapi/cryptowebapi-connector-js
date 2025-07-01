import { WalletCreator } from '../interfaces/wallet-creator.interface.js';
import { SupportedNetwork } from '../../../types.js';

/**
 * Factory class for creating network-specific wallet services
 * Implements the Factory pattern for clean service instantiation
 */
export class WalletCreateFactory {
  private services: Map<SupportedNetwork, WalletCreator> = new Map();

  constructor() {
    this.initializeServices();
  }

  /**
   * Initialize all network-specific wallet creation services
   */
  private async initializeServices(): Promise<void> {
    // Dynamically import services to avoid circular dependencies and reduce bundle size
    const [
      { EthereumWalletService },
      { BitcoinWalletService },
      { BnbWalletService },
      { TronWalletService }
    ] = await Promise.all([
      import('../services/ethereum-wallet.service.js'),
      import('../services/bitcoin-wallet.service.js'),
      import('../services/bnb-wallet.service.js'),
      import('../services/tron-wallet.service.js')
    ]);

    this.services.set('ethereum', new EthereumWalletService());
    this.services.set('bitcoin', new BitcoinWalletService());
    this.services.set('bnb', new BnbWalletService());
    this.services.set('tron', new TronWalletService());
  }

  /**
   * Get the appropriate wallet service for the specified network
   * @param network - The blockchain network
   * @returns The wallet creation service for the network
   * @throws Error if the network is not supported
   */
  async getService(network: SupportedNetwork): Promise<WalletCreator> {
    // Ensure services are initialized
    if (this.services.size === 0) {
      await this.initializeServices();
    }

    const service = this.services.get(network);
    if (!service) {
      throw new Error(`Unsupported network: ${network}. Supported networks: ${Array.from(this.services.keys()).join(', ')}`);
    }

    return service;
  }

  /**
   * Get all supported networks
   * @returns Array of supported network names
   */
  getSupportedNetworks(): SupportedNetwork[] {
    return Array.from(this.services.keys());
  }
}

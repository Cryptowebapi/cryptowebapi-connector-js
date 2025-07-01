/**
 * Mnemonic Recovery Factory
 * 
 * Factory class for creating network-specific mnemonic recovery services
 */

import { SupportedNetwork } from '../../../types.js';
import { MnemonicRecoveryInterface } from '../interfaces/mnemonic-recovery.interface.js';

export class MnemonicRecoveryFactory {
  /**
   * Get the appropriate mnemonic recovery service for a network
   */
  async getService(network: SupportedNetwork): Promise<MnemonicRecoveryInterface> {
    switch (network) {
      case 'ethereum': {
        const { EthereumMnemonicService } = await import('../services/ethereum-mnemonic.service.js');
        return new EthereumMnemonicService();
      }
      case 'bitcoin': {
        const { BitcoinMnemonicService } = await import('../services/bitcoin-mnemonic.service.js');
        return new BitcoinMnemonicService();
      }
      case 'bnb': {
        const { BnbMnemonicService } = await import('../services/bnb-mnemonic.service.js');
        return new BnbMnemonicService();
      }
      case 'tron': {
        const { TronMnemonicService } = await import('../services/tron-mnemonic.service.js');
        return new TronMnemonicService();
      }
      default:
        throw new Error(`Unsupported network for mnemonic recovery: ${network}`);
    }
  }

  /**
   * Get list of supported networks for mnemonic recovery
   */
  getSupportedNetworks(): SupportedNetwork[] {
    return ['ethereum', 'bitcoin', 'bnb', 'tron'];
  }
}

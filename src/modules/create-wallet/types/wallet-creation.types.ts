import { SupportedNetwork } from '../../../types.js';

/**
 * Request parameters for wallet creation
 */
export interface CreateWalletOptions {
  /** The blockchain network to create the wallet for */
  network: SupportedNetwork;
  /** The network mode (mainnet or testnet) */
  mode?: 'mainnet' | 'testnet';
}

/**
 * Validation options for wallet creation
 */
export interface WalletValidationOptions {
  /** Whether to validate the generated mnemonic */
  validateMnemonic?: boolean;
  /** Whether to validate the generated address format */
  validateAddress?: boolean;
}

/**
 * Extended wallet creation options
 */
export interface ExtendedCreateWalletOptions extends CreateWalletOptions {
  /** Validation options */
  validation?: WalletValidationOptions;
}

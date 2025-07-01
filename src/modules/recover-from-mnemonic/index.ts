import { MnemonicRecoveryFactory } from './factories/mnemonic-recovery.factory.js';
import type { 
  MnemonicRecoveryOptions, 
  MnemonicRecoveryResult, 
  SupportedNetworks 
} from './types/mnemonic-recovery.types.js';

/**
 * Recovers wallet information (address, public key, private key) from a mnemonic phrase
 * @param network - The blockchain network (bitcoin, ethereum, bnb, tron)
 * @param mnemonic - The BIP-39 mnemonic phrase
 * @param options - Optional recovery options (mode: mainnet/testnet)
 * @returns Promise<MnemonicRecoveryResult> - The recovered wallet information
 */
export async function recoverFromMnemonic(
  network: SupportedNetworks,
  mnemonic: string,
  options?: MnemonicRecoveryOptions
): Promise<MnemonicRecoveryResult> {
  const factory = new MnemonicRecoveryFactory();
  const service = await factory.getService(network);
  return await service.recoverFromMnemonic(mnemonic, options?.mode);
}

// Export types for external use
export type {
  MnemonicRecoveryOptions,
  MnemonicRecoveryResult,
  SupportedNetworks,
} from './types/mnemonic-recovery.types.js';

export type { MnemonicRecoveryInterface } from './interfaces/mnemonic-recovery.interface.js';

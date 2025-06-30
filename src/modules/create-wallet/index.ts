import { CreateWalletRequest, CreateWalletResponse } from '../../types';
import { ApiRequest } from '../../lib/request';
import { WalletCreateFactory } from './factories/wallet-create.factory';
import { CreateWalletOptions } from './types/wallet-creation.types';

// Export types and interfaces for external use
export * from './interfaces/wallet-creator.interface';
export * from './types/wallet-creation.types';
export * from './factories/wallet-create.factory';

// Export services for direct use if needed
export * from './services/ethereum-wallet.service';
export * from './services/bitcoin-wallet.service';
export * from './services/bnb-wallet.service';
export * from './services/tron-wallet.service';

/**
 * Create a new wallet for the specified network
 *
 * This function can work in two modes:
 * 1. Using CryptoWebAPI (when apiRequest is provided)
 * 2. Using local wallet generation (when apiRequest is not provided)
 *
 * @param request - The wallet creation request parameters
 * @param apiRequest - Optional API request instance for CryptoWebAPI integration
 * @returns Promise<CreateWalletResponse> - The created wallet details
 */
export async function createWallet(
  request: CreateWalletRequest,
  apiRequest?: ApiRequest
): Promise<CreateWalletResponse> {
  const { network } = request;

  // If apiRequest is provided, use CryptoWebAPI
  if (apiRequest) {
    const params = {
      network: request.network,
    };

    return apiRequest.makeRequest<CreateWalletResponse>(
      'GET',
      '/api/wallet/create',
      undefined,
      { params }
    );
  }

  // Otherwise, use local wallet generation based on network
  try {
    const factory = new WalletCreateFactory();
    const service = await factory.getService(network);
    
    const mode = ('mode' in request ? request.mode : 'mainnet') as 'mainnet' | 'testnet';
    const result = await service.createWallet(mode);

    return {
      success: true,
      message: `${network} wallet created successfully`,
      network,
      address: result.address,
      key: result.key,
      mnemonic: result.mnemonic,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: `Failed to create ${network} wallet: ${errorMessage}`,
      network,
      address: '',
      key: '',
      mnemonic: '',
    };
  }
}

/**
 * Direct wallet creation using the factory pattern
 * This is a more advanced API for users who want direct access to the services
 *
 * @param options - Wallet creation options
 * @returns Promise containing wallet details
 */
export async function createWalletDirect(options: CreateWalletOptions) {
  const factory = new WalletCreateFactory();
  const service = await factory.getService(options.network);
  return service.createWallet(options.mode);
}

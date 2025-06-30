import { AddressFromMnemonicRequest, AddressFromMnemonicResponse } from '../../types';
import { ApiRequest } from '../../lib/request';

/**
 * Generate Address from Mnemonic Module
 * 
 * Derives wallet address from a given mnemonic phrase for a specific network
 * Useful for address recovery and multi-address generation from the same seed
 */

/**
 * Generate wallet address from a mnemonic phrase
 * 
 * @param request - Address generation request parameters
 * @param apiRequest - API request instance for making the HTTP call
 * @returns Promise<AddressFromMnemonicResponse> - Generated address information
 */
export async function generateAddressFromMnemonic(
  request: AddressFromMnemonicRequest,
  apiRequest: ApiRequest
): Promise<AddressFromMnemonicResponse> {
  const requestBody = {
    network: request.network,
    mnemonic: request.mnemonic,
    mode: request.mode || 'mainnet',
  };

  return apiRequest.makeRequest<AddressFromMnemonicResponse>(
    'POST',
    '/api/wallet/address-from-mnemonic',
    requestBody
  );
}

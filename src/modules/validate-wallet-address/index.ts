import { WalletValidationRequest, WalletValidationResponse } from '../../types.js';
import { ApiRequest } from '../../lib/request.js';

/**
 * Validate Wallet Address Module
 * 
 * Validates whether a wallet address is valid for a specific blockchain network
 * Checks address format and network compatibility
 */

/**
 * Validate a wallet address for a specific network
 * 
 * @param request - Wallet validation request parameters
 * @param apiRequest - API request instance for making the HTTP call
 * @returns Promise<WalletValidationResponse> - Validation result
 */
export async function validateWalletAddress(
  request: WalletValidationRequest,
  apiRequest: ApiRequest
): Promise<WalletValidationResponse> {
  const params = {
    network: request.network,
    address: request.address,
  };

  return apiRequest.makeRequest<WalletValidationResponse>(
    'GET',
    '/api/info/wallet-validation',
    undefined,
    { params }
  );
}

import { AccountNonceRequest, AccountNonceResponse } from '../../types';
import { ApiRequest } from '../../lib/request';

/**
 * Get Account Nonce Module
 * 
 * Retrieves the current nonce for an account address from the blockchain
 * The nonce is required for creating transactions on EVM-compatible networks
 */

/**
 * Get the current nonce for an account address
 * 
 * @param request - Account nonce request parameters
 * @param apiRequest - API request instance for making the HTTP call
 * @returns Promise<AccountNonceResponse> - Current nonce for the address
 */
export async function getAccountNonce(
  request: AccountNonceRequest,
  apiRequest: ApiRequest
): Promise<AccountNonceResponse> {
  const params = {
    network: request.network,
    address: request.address,
    ...(request.mode && { mode: request.mode }),
  };

  return apiRequest.makeRequest<AccountNonceResponse>(
    'GET',
    '/api/blockchain/nonce',
    undefined,
    { params }
  );
}

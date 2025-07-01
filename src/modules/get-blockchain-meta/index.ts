import { BlockchainMetaRequest, BlockchainMetaResponse } from '../../types.js';
import { ApiRequest } from '../../lib/request.js';

/**
 * Get Blockchain Meta Module
 * 
 * Retrieves transaction metadata needed for building and signing transactions.
 * Provides current fee data, gas limits, chain ID, nonce, and balance information.
 * 
 * @param request - The blockchain meta request parameters
 * @param apiRequest - The API request instance
 * @returns Promise resolving to blockchain metadata
 */
export async function getBlockchainMeta(
  request: BlockchainMetaRequest,
  apiRequest: ApiRequest
): Promise<BlockchainMetaResponse> {
  const params: Record<string, string> = {
    network: request.network
  };

  // Add optional address parameter for account-specific data
  if (request.address) {
    params.address = request.address;
  }

  // Add mode parameter if specified
  if (request.mode) {
    params.mode = request.mode;
  }

  return await apiRequest.makeRequest<BlockchainMetaResponse>(
    'GET',
    '/api/blockchain/transaction-meta',
    undefined,
    { params }
  );
}

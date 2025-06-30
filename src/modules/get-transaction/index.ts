import { GetTransactionRequest, GetTransactionResponse } from '../../types';
import { ApiRequest } from '../../lib/request';

/**
 * Get Transaction Module
 * 
 * Retrieves real-time transaction details from the blockchain
 * Provides detailed information about a specific transaction by its ID
 */

/**
 * Get detailed information about a specific transaction
 * 
 * @param request - Transaction request parameters
 * @param apiRequest - API request instance for making the HTTP call
 * @returns Promise<GetTransactionResponse> - Transaction details
 */
export async function getTransaction(
  request: GetTransactionRequest,
  apiRequest: ApiRequest
): Promise<GetTransactionResponse> {
  const params = {
    network: request.network,
    transactionId: request.transactionId,
  };

  return apiRequest.makeRequest<GetTransactionResponse>(
    'GET',
    '/api/blockchain/transaction',
    undefined,
    { params }
  );
}

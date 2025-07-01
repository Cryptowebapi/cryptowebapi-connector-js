import { SendTransactionRequest, SendTransactionResponse } from '../../types.js';
import { ApiRequest } from '../../lib/request.js';

/**
 * Send Transaction Module
 * 
 * Broadcasts a signed raw transaction to the blockchain network
 * Handles transaction submission and returns transaction hash upon success
 */

/**
 * Send a signed raw transaction to the blockchain
 * 
 * @param request - Send transaction request parameters
 * @param apiRequest - API request instance for making the HTTP call
 * @returns Promise<SendTransactionResponse> - Transaction broadcast result
 */
export async function sendTransaction(
  request: SendTransactionRequest,
  apiRequest: ApiRequest
): Promise<SendTransactionResponse> {
  const requestBody = {
    rawTx: request.rawTx,
    network: request.network,
    mode: request.mode || 'mainnet',
  };

  return apiRequest.makeRequest<SendTransactionResponse>(
    'POST',
    '/api/wallet/send',
    requestBody
  );
}

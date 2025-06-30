import { WalletBalanceRequest, WalletBalanceResponse } from '../../types';
import { ApiRequest } from '../../lib/request';

/**
 * Get Wallet Balance Module
 * 
 * Retrieves wallet balance for native tokens and specified token contracts
 * Supports both mainnet and testnet balance queries
 */

/**
 * Get wallet balance for native and token balances
 * 
 * @param request - Wallet balance request parameters
 * @param apiRequest - API request instance for making the HTTP call
 * @returns Promise<WalletBalanceResponse> - Wallet balance information
 */
export async function getWalletBalance(
  request: WalletBalanceRequest,
  apiRequest: ApiRequest
): Promise<WalletBalanceResponse> {
  const requestBody = {
    network: request.network,
    address: request.address,
    mode: request.mode || 'mainnet',
    ...(request.tokens && { tokens: request.tokens }),
  };

  return apiRequest.makeRequest<WalletBalanceResponse>(
    'POST',
    '/api/wallet/balance',
    requestBody
  );
}

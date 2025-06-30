import { SupportedCoinsRequest, SupportedCoinsResponse } from '../../types';
import { ApiRequest } from '../../lib/request';

/**
 * Get Supported Coins Module
 * 
 * Retrieves metadata about supported cryptocurrencies and tokens
 * Provides information about available coins, their symbols, and contract addresses
 */

/**
 * Get supported coins metadata for a specific network or all networks
 * 
 * @param request - Supported coins request parameters
 * @param apiRequest - API request instance for making the HTTP call
 * @returns Promise<SupportedCoinsResponse> - List of supported coins with metadata
 */
export async function getSupportedCoins(
  request: SupportedCoinsRequest,
  apiRequest: ApiRequest
): Promise<SupportedCoinsResponse> {
  const params: any = {};

  // Only add network parameter if provided
  if (request.network) {
    params.network = request.network;
  }

  return apiRequest.makeRequest<SupportedCoinsResponse>(
    'GET',
    '/api/info/supported-coins',
    undefined,
    { params }
  );
}

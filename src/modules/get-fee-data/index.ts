import { FeeDataRequest, FeeDataResponse } from '../../types.js';
import { ApiRequest } from '../../lib/request.js';

/**
 * Get Fee Data Module
 * 
 * Retrieves current network fee information including gas price
 * Essential for calculating transaction costs on blockchain networks
 */

/**
 * Get current fee data for a blockchain network
 * 
 * @param request - Fee data request parameters
 * @param apiRequest - API request instance for making the HTTP call
 * @returns Promise<FeeDataResponse> - Current fee data for the network
 */
export async function getFeeData(
  request: FeeDataRequest,
  apiRequest: ApiRequest
): Promise<FeeDataResponse> {
  const params: any = {
    network: request.network,
  };

  if (request.mode) {
    params.mode = request.mode;
  }

  return apiRequest.makeRequest<FeeDataResponse>(
    'GET',
    '/api/blockchain/feeData',
    undefined,
    { params }
  );
}

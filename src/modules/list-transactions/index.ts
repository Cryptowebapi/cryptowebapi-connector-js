import { ListTransactionsRequest, ListTransactionsResponse } from '../../types';
import { ApiRequest } from '../../lib/request';

/**
 * List Transactions Module
 * 
 * Retrieves a list of transactions with filtering and pagination options
 * Provides access to 7-day transaction history with advanced filtering
 */

/**
 * List transactions with filtering and pagination
 * 
 * @param request - Transaction list request parameters with filters
 * @param apiRequest - API request instance for making the HTTP call
 * @returns Promise<ListTransactionsResponse> - List of transactions
 */
export async function listTransactions(
  request: ListTransactionsRequest,
  apiRequest: ApiRequest
): Promise<ListTransactionsResponse> {
  const params: any = {
    network: request.network,
  };

  // Add optional parameters if they exist
  if (request.address) params.address = request.address;
  if (request.fromAddress) params.fromAddress = request.fromAddress;
  if (request.toAddress) params.toAddress = request.toAddress;
  if (request.txType) params.txType = request.txType;
  if (request.tokenSymbol) params.tokenSymbol = request.tokenSymbol;

  // Value filters
  if (request.fromValue !== undefined) params.fromValue = request.fromValue;
  if (request.toValue !== undefined) params.toValue = request.toValue;
  if (request.minValueDecimal !== undefined) params.minValueDecimal = request.minValueDecimal;
  if (request.maxValueDecimal !== undefined) params.maxValueDecimal = request.maxValueDecimal;

  // Fee filters
  if (request.minFeeDecimal !== undefined) params.minFeeDecimal = request.minFeeDecimal;
  if (request.maxFeeDecimal !== undefined) params.maxFeeDecimal = request.maxFeeDecimal;

  // Date filters
  if (request.fromTimestamp) params.fromTimestamp = request.fromTimestamp;
  if (request.toTimestamp) params.toTimestamp = request.toTimestamp;
  if (request.startDate) params.startDate = request.startDate;
  if (request.endDate) params.endDate = request.endDate;

  // Sorting
  if (request.sortBy) params.sortBy = request.sortBy;
  if (request.sortOrder) params.sortOrder = request.sortOrder;

  // Pagination
  if (request.limit !== undefined) params.limit = request.limit;
  if (request.offset !== undefined) params.offset = request.offset;

  return apiRequest.makeRequest<ListTransactionsResponse>(
    'GET',
    '/api/blockchain/transactions',
    undefined,
    { params }
  );
}

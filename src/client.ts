import {
  CryptoApiConfig,
  ApiResponse,
  Transaction,
  GetTransactionRequest,
  GetTransactionResponse,
  TransactionData,
  ListTransactionsRequest,
  ListTransactionsResponse,
  SupportedCoinsRequest,
  SupportedCoinsResponse,
  CoinData,
  WalletValidationRequest,
  WalletValidationResponse,
  WalletBalanceRequest,
  WalletBalanceResponse,
  BalanceData,
  SupportedNetwork,
  CreateWalletRequest,
  CreateWalletResponse,
  SendTransactionRequest,
  SendTransactionResponse,
  SendTransactionData,
} from './types';
import { ApiRequest } from './lib/request';

export class CryptoWebApiClient {
  private apiRequest: ApiRequest;

  constructor(config: CryptoApiConfig) {
    this.apiRequest = new ApiRequest(config);
  }

  /**
   * Get current configuration
   */
  getConfig(): CryptoApiConfig {
    return this.apiRequest.getConfig();
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<CryptoApiConfig>): void {
    this.apiRequest.updateConfig(newConfig);
  }

  // ========================================
  // BLOCKCHAIN ENDPOINT
  // ========================================
  /**
   * Get Transaction (Real-time)
   * GET /api/blockchain/transaction
   */
  async getTransaction(request: GetTransactionRequest): Promise<GetTransactionResponse> {
    const params = {
      network: request.network,
      transactionId: request.transactionId,
    };

    return this.apiRequest.makeRequest<GetTransactionResponse>(
      'GET',
      '/api/blockchain/transaction',
      undefined,
      { params }
    );
  }
  /**
   * List Transactions (7-Day History)
   * GET /api/blockchain/transactions
   */
  async listTransactions(request: ListTransactionsRequest): Promise<ListTransactionsResponse> {
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

    return this.apiRequest.makeRequest<ListTransactionsResponse>(
      'GET',
      '/api/blockchain/transactions',
      undefined,
      {
        params,
      }
    );
  }
  // ========================================
  // INFO ENDPOINT
  // ========================================
  /**
   * Get Supported Coins Metadata
   * GET /api/info/supported-coins
   */
  async getSupportedCoins(request: SupportedCoinsRequest): Promise<SupportedCoinsResponse> {
    const params = {
      network: request.network,
    };

    return this.apiRequest.makeRequest<SupportedCoinsResponse>(
      'GET',
      '/api/info/supported-coins',
      undefined,
      {
        params,
      }
    );
  }

  /**
   * Validate Wallet Address
   * GET /api/info/wallet-validation
   */
  async validateWalletAddress(request: WalletValidationRequest): Promise<WalletValidationResponse> {
    const params = {
      network: request.network,
      address: request.address,
    };

    const response = await this.apiRequest.makeRequest<any>(
      'GET',
      '/api/info/wallet-validation',
      undefined,
      {
        params,
      }
    );

    // Transform the response to match WalletValidationResponse structure
    return {
      success: response.success,
      message: response.message,
      network: response.network,
      address: request.address,
      valid: response.data?.valid || false,
    };
  }
  // ========================================
  // WALLET ENDPOINT
  // ========================================

  /**
   * Retrieve Wallet Balance
   * POST /api/wallet/balance
   */
  async getWalletBalance(request: WalletBalanceRequest): Promise<WalletBalanceResponse> {
    const requestBody = {
      network: request.network,
      address: request.address,
      mode: request.mode || 'mainnet',
      ...(request.tokens && { tokens: request.tokens }),
    };

    const response = await this.apiRequest.makeRequest<any>(
      'POST',
      '/api/wallet/balance',
      requestBody
    );

    return {
      success: response.success,
      message: response.message,
      network: response.network as SupportedNetwork,
      address: request.address,
      data: response.data || [],
    };
  }

  /**
   * Create a New Wallet
   * GET /api/wallet/create
   */
  async createWallet(request: CreateWalletRequest): Promise<CreateWalletResponse> {
    const params = {
      network: request.network,
    };

    const response = await this.apiRequest.makeRequest<any>(
      'GET',
      '/api/wallet/create',
      undefined,
      {
        params,
      }
    );

    // Transform the response to match CreateWalletResponse structure
    return {
      success: response.success,
      message: response.message,
      network: response.network as SupportedNetwork,
      address: response.data?.address || '',
      key: response.data?.key || '',
      mnemonic: response.data?.mnemonic || '',
    };
  }

  /**
   * Send Raw Transaction
   * POST /api/wallet/send
   */
  async sendTransaction(request: SendTransactionRequest): Promise<SendTransactionResponse> {
    const requestBody = {
      rawTx: request.rawTx,
      network: request.network,
      mode: request.mode || 'mainnet',
    };
    const response = await this.apiRequest.makeRequest<any>(
      'POST',
      '/api/wallet/send',
      requestBody
    );

    return {
      success: response.success,
      message: response.message,
      network: response.network as SupportedNetwork,
      data: response.data || { txId: '' },
    };
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Get API key from the underlying request client
   */
  getApiKey(): string {
    return this.apiRequest.getApiKey();
  }
}

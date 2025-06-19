import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
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
import {
  CryptoApiError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
} from './errors';

export class CryptoWebApiClient {
  private axios: AxiosInstance;
  private config: CryptoApiConfig;

  constructor(config: CryptoApiConfig) {
    this.config = {
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };

    this.axios = axios.create({
      baseURL: 'https://api.cryptowebapi.com',
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axios.interceptors.request.use(
      (config) => {
        // Add timestamp to all requests
        config.params = { ...config.params, _t: Date.now() };
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 401:
              throw new AuthenticationError(data?.message || 'Authentication failed');
            case 404:
              throw new NotFoundError(data?.message || 'Resource not found');
            case 429:
              throw new RateLimitError(data?.message || 'Rate limit exceeded');
            default:
              throw new CryptoApiError(
                data?.message || 'API request failed',
                'API_ERROR',
                status,
                error
              );
          }
        } else if (error.request) {
          throw new NetworkError('Network error occurred', error);
        } else {
          throw new CryptoApiError('Unknown error occurred', 'UNKNOWN_ERROR', undefined, error);
        }
      }
    );
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.config.retryAttempts!; attempt++) {
      try {
        const response: AxiosResponse<ApiResponse<T>> = await this.axios({
          method,
          url: endpoint,
          data,
          ...config,
        });

        return response.data;
      } catch (error) {
        lastError = error;

        // Don't retry on authentication or validation errors
        if (
          error instanceof AuthenticationError ||
          error instanceof NotFoundError ||
          (error instanceof CryptoApiError && error.statusCode === 400)
        ) {
          throw error;
        }

        if (attempt < this.config.retryAttempts!) {
          await this.delay(this.config.retryDelay! * attempt);
        }
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
      key: this.config.apiKey,
      network: request.network,
      transactionId: request.transactionId,
    };

    return this.makeRequest<TransactionData>('GET', '/api/blockchain/transaction', undefined, {
      params,
    }) as Promise<GetTransactionResponse>;
  }

  /**
   * List Transactions (7-Day History)
   * GET /api/blockchain/transactions
   */
  async listTransactions(request: ListTransactionsRequest): Promise<ListTransactionsResponse> {
    const params: any = {
      key: this.config.apiKey,
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

    return this.makeRequest<TransactionData[]>('GET', '/api/blockchain/transactions', undefined, {
      params,
    }) as Promise<ListTransactionsResponse>;
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
      key: this.config.apiKey,
      network: request.network,
    };

    return this.makeRequest<CoinData[]>('GET', '/api/info/supported-coins', undefined, {
      params,
    }) as Promise<SupportedCoinsResponse>;
  }
  /**
   * Validate Wallet Address
   * GET /api/info/wallet-validation
   */
  async validateWalletAddress(request: WalletValidationRequest): Promise<WalletValidationResponse> {
    const params = {
      key: this.config.apiKey,
      network: request.network,
      address: request.address,
    };

    const response = await this.makeRequest<any>('GET', '/api/info/wallet-validation', undefined, {
      params,
    });

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
      key: this.config.apiKey,
      network: request.network,
      address: request.address,
      mode: request.mode || 'mainnet',
      ...(request.tokens && { tokens: request.tokens }),
    };

    const response = await this.makeRequest<BalanceData[]>(
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
      key: this.config.apiKey,
      network: request.network,
    };

    const response = await this.makeRequest<any>('GET', '/api/wallet/create', undefined, {
      params,
    });

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
      key: this.config.apiKey,
      rawTx: request.rawTx,
      network: request.network,
      mode: request.mode || 'mainnet',
    };

    const response = await this.makeRequest<SendTransactionData>(
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
   * Update client configuration
   */
  updateConfig(newConfig: Partial<CryptoApiConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.timeout) {
      this.axios.defaults.timeout = newConfig.timeout;
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): CryptoApiConfig {
    return { ...this.config };
  }
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  CryptoApiConfig,
  ApiResponse,
  Transaction,
  GetTransactionRequest,
  GetTransactionResponse,
  TransactionData,
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

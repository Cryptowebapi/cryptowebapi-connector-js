import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { CryptoApiConfig } from '../types.js';
import { isAxiosError, ApiRequestError } from '../errors.js';

export class ApiRequest {
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
        // Add timestamp and API key to all requests as query parameters
        config.params = { 
          ...config.params, 
          _t: Date.now(),
          ...(this.config.apiKey && { key: this.config.apiKey })
        };

        return config;
      },
      (error) => Promise.reject(error)
    );    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Return the original axios error without modification
        // This preserves the axios error format with response, request, config properties
        return Promise.reject(error);
      }
    );
  }  /**
   * Make an API request with automatic retries
   * 
   * @param method - HTTP method
   * @param endpoint - API endpoint
   * @param data - Request data (for POST/PUT)
   * @param config - Additional Axios config
   * @returns Promise with the response data
   * @throws ApiRequestError if the request fails after all retry attempts
   */
  async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 1; attempt <= this.config.retryAttempts!; attempt++) {
      try {
        const response = await this.axios({
          method,
          url: endpoint,
          data,
          ...config,
        });

        return response.data as T;
      } catch (error) {
        // Convert to Error type if it's not already
        const err = error instanceof Error ? error : new Error(String(error));
        lastError = err;

        // Don't retry on authentication, validation, or not found errors
        if (isAxiosError(err) && err.response) {
          const status = err.response.status;
          if (status === 401 || status === 400 || status === 404) {
            throw new ApiRequestError(
              `API request failed: ${err.message}`,
              err,
              status
            );
          }
        }

        if (attempt < this.config.retryAttempts!) {
          await this.delay(this.config.retryDelay! * attempt);
        }
      }
    }

    // If we get here, all retry attempts failed
    if (isAxiosError(lastError)) {
      throw new ApiRequestError(
        `API request failed after ${this.config.retryAttempts} attempts: ${lastError.message}`,
        lastError,
        lastError.response?.status
      );
    }

    throw new ApiRequestError(
      `API request failed after ${this.config.retryAttempts} attempts: ${lastError.message}`,
      lastError
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getApiKey(): string {
    return this.config.apiKey;
  }

  /**
   * Get current configuration
   */
  getConfig(): CryptoApiConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<CryptoApiConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Update axios instance with new timeout if provided
    if (newConfig.timeout !== undefined) {
      this.axios.defaults.timeout = newConfig.timeout;
    }
  }
}

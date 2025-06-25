import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { CryptoApiConfig } from '../types';
import { isAxiosError } from '../errors';

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
  }  async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<any> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.config.retryAttempts!; attempt++) {
      try {
        const response = await this.axios({
          method,
          url: endpoint,
          data,
          ...config,
        });

        return response.data;
      } catch (error) {
        lastError = error;        // Don't retry on authentication, validation, or not found errors
        if (isAxiosError(error) && error.response) {
          const status = error.response.status;
          if (status === 401 || status === 400 || status === 404) {
            throw error;
          }
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

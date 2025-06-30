// Re-export Axios error types for users who want to handle specific error types
export { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';

/**
 * Base error class for CryptoWebAPI errors
 */
export class CryptoWebApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CryptoWebApiError';
    // This is necessary for proper instanceof checks in ES5
    Object.setPrototypeOf(this, CryptoWebApiError.prototype);
  }
}

/**
 * Error thrown when API request fails
 */
export class ApiRequestError extends CryptoWebApiError {
  public readonly status?: number;
  public readonly originalError: Error;

  constructor(message: string, originalError: Error, status?: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.originalError = originalError;
    this.status = status;
    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends CryptoWebApiError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when wallet creation fails
 */
export class WalletCreationError extends CryptoWebApiError {
  constructor(message: string) {
    super(message);
    this.name = 'WalletCreationError';
    Object.setPrototypeOf(this, WalletCreationError.prototype);
  }
}

// Type guard to check if error is an Axios error
export function isAxiosError(error: unknown): error is AxiosError {
  return error != null && (error as AxiosError).isAxiosError === true;
}

// Helper function to get error message from Axios error
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return (error.response?.data as Record<string, unknown>)?.message as string || error.message || 'Request failed';
  }
  return error instanceof Error ? error.message : 'Unknown error occurred';
}

// Helper function to get status code from Axios error
export function getErrorStatus(error: unknown): number | undefined {
  if (isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
}

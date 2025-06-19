export class CryptoApiError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly originalError?: any;

  constructor(message: string, code: string, statusCode?: number, originalError?: any) {
    super(message);
    this.name = 'CryptoApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.originalError = originalError;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, CryptoApiError);
    }
  }
}

export class NetworkError extends CryptoApiError {
  constructor(message: string, originalError?: any) {
    super(message, 'NETWORK_ERROR', undefined, originalError);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends CryptoApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends CryptoApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_ERROR', 429);
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends CryptoApiError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends CryptoApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND_ERROR', 404);
    this.name = 'NotFoundError';
  }
}

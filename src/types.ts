// Supported blockchain networks
export type SupportedNetwork = 'ethereum' | 'bnb' | 'bitcoin' | 'tron';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  transactionId: string;
  data?: T;
}

// Get Transaction Response
export interface GetTransactionResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  transactionId: string;
  data: TransactionData;
}

// Transaction Data
export interface TransactionData {
  hash: string;
  blockNumber: string;
  timestamp: string; // ISO date format like "2023-01-15T14:30:45Z"
  fromAddress: string;
  toAddress: string;
  valueDecimal: string;
  feeDecimal: string;
  status: string; // "confirmed", "pending", "failed"
  tokenSymbol: string;
}

// Configuration Types
export interface CryptoApiConfig {
  apiKey: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

// Get Transaction Types
export interface GetTransactionRequest {
  network: SupportedNetwork;
  transactionId: string;
}

// Backwards compatibility - Transaction interface points to TransactionData
export interface Transaction extends TransactionData {}

// Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
  network?: string;
  transactionId?: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  statusCode?: number;
}

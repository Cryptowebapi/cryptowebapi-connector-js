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

// List Transactions Types
export interface ListTransactionsRequest {
  network: SupportedNetwork;

  // Address filters
  address?: string;
  fromAddress?: string;
  toAddress?: string;

  // Transaction type and token filters
  txType?: string;
  tokenSymbol?: string;

  // Value filters (deprecated field names for compatibility)
  fromValue?: number;
  toValue?: number;

  // Value filters (new field names)
  minValueDecimal?: number;
  maxValueDecimal?: number;

  // Fee filters
  minFeeDecimal?: number;
  maxFeeDecimal?: number;

  // Date filters (deprecated field names for compatibility)
  fromTimestamp?: string;
  toTimestamp?: string;

  // Date filters (new field names)
  startDate?: string;
  endDate?: string;

  // Sorting
  sortBy?: 'timestamp' | 'valueDecimal' | 'feeDecimal';
  sortOrder?: 'asc' | 'desc';

  // Pagination
  limit?: number; // max 1000
  offset?: number;
}

// List Transactions Response
export interface ListTransactionsResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  data: TransactionData[];
}

// Supported Coins Types
export interface SupportedCoinsRequest {
  network: SupportedNetwork;
}

export interface CoinData {
  name: string;
  shortName: string;
  tag: string;
  symbol: string;
  type: string;
  decimals: number;
  contractAddress: string;
  provider: string;
}

export interface SupportedCoinsResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  data: CoinData[];
}

// Wallet Validation Types
export interface WalletValidationRequest {
  network: SupportedNetwork;
  address: string;
}

export interface WalletValidationResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  address: string;
  valid: boolean;
}

// Wallet Balance Types
export interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  type: string;
  tag: string;
}

export interface WalletBalanceRequest {
  network: SupportedNetwork;
  address: string;
  mode?: 'mainnet' | 'testnet';
  tokens?: TokenInfo[];
}

export interface BalanceData {
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
  isToken: boolean;
}

export interface WalletBalanceResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  address: string;
  data: BalanceData[];
}

// Wallet Create Types
export interface CreateWalletRequest {
  network: SupportedNetwork;
}

export interface CreateWalletResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  address: string;
  key: string;
  mnemonic: string;
}

// Send Transaction Types
export interface SendTransactionRequest {
  rawTx: string;
  network: SupportedNetwork;
  mode?: 'mainnet' | 'testnet';
}

export interface SendTransactionData {
  txId: string;
}

export interface SendTransactionResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  data: SendTransactionData;
}

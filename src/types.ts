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
  type: string;
  status: string; // "confirmed", "pending", "failed"
  blockHash: string;
  blockNumber: number;
  confirmations: number;
  timestamp: string; // ISO date format like "2025-06-20T14:19:59.000Z"
  from: string;
  to: string;
  valueWei: string;
  valueEth: string;
  gasLimit: string;
  gasPriceWei: string;
  gasPriceGwei: string;
  gasUsed: string;
  feeEstimateEth: string;
  isContractCall: boolean;
  data: string;
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

// List Transactions Data (different structure from TransactionData)
export interface ListTransactionData {
  network: SupportedNetwork;
  hash: string;
  fromAddress: string;
  toAddress: string;
  blockHeight: string;
  blockTime: string;
  timestamp: string; // ISO date format like "2025-06-22T07:27:11+00:00"
  nonce: string;
  txType: string;
  valueRaw: string;
  valueDecimal: number;
  feeRaw: string;
  feeDecimal: number;
  gasUsed: string;
  gasPriceWei: string;
  tokenSymbol: string | null;
  tokenContract: string;
  programId: string | null;
  slot: string | null;
}

// List Transactions Response
export interface ListTransactionsResponse {
  success: boolean;
  data: ListTransactionData[];
}

// Supported Coins Types
export interface SupportedCoinsRequest {
  network?: SupportedNetwork;
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
  usdRate: number;
  usdRateUpdatedAt: string;
  logo: string;
}

export interface SupportedCoinsResponse extends Array<CoinData> {}

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

// Address from Mnemonic Types
export interface AddressFromMnemonicRequest {
  network: SupportedNetwork;
  mnemonic: string;
  mode?: 'mainnet' | 'testnet';
}

export interface AddressFromMnemonicData {
  network: SupportedNetwork;
  address: string;
  publicKey: string;
  privateKey: string;
  path: string;
}

export interface AddressFromMnemonicResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  data: AddressFromMnemonicData;
}

// Fee Data Types
// Blockchain Meta Types (replaces FeeData and AccountNonce)
export interface BlockchainMetaRequest {
  network: SupportedNetwork;
  address?: string; // Optional: get account-specific data like nonce and balance
  mode?: 'mainnet' | 'testnet';
}

export interface BlockchainMetaResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  data: {
    // Fee data
    gasPrice: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    gasLimit?: {
      transfer: string;
      contractCall: string;
      tokenTransfer: string;
    };
    // Chain information
    chainId?: number;
    blockHeight?: number;
    // Account-specific data (when address is provided)
    nonce?: number;
    balance?: string;
    balanceFormatted?: string;
  };
}

// Transaction Builder Types
export interface TransactionBuilderRequest {
  network: SupportedNetwork;
  privateKey: string;
  receiver: string;
  value: string | number;
  mode?: 'mainnet' | 'testnet';
  contractAddress?: string; // Required for token transactions
  contractDecimal?: number; // Required for token transactions
}

export interface TransactionBuilderResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  data: {
    status: 'build';
    type: 'erc20' | 'bep20' | 'native'; // BEP20 for BNB Smart Chain tokens
    from: string;
    to: string;
    value: string;
    rawTx: string;
    gasPrice: string;
    gasLimit: string;
    estimatedFeeEth: string;
    nonce: string;
    chainId: string;
  };
}

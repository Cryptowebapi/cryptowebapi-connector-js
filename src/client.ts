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
  AddressFromMnemonicRequest,
  AddressFromMnemonicResponse,
  FeeDataRequest,
  FeeDataResponse,
  AccountNonceRequest,
  AccountNonceResponse,
  TransactionBuilderRequest,
  TransactionBuilderResponse,
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
    const { getTransaction: moduleGetTransaction } = await import('./modules/get-transaction');
    return moduleGetTransaction(request, this.apiRequest);
  }
  /**
   * List Transactions (7-Day History)
   * GET /api/blockchain/transactions
   */
  async listTransactions(request: ListTransactionsRequest): Promise<ListTransactionsResponse> {
    const { listTransactions: moduleListTransactions } = await import('./modules/list-transactions');
    return moduleListTransactions(request, this.apiRequest);
  }
  // ========================================
  // INFO ENDPOINT
  // ========================================
  /**
   * Get Supported Coins Metadata
   * GET /api/info/supported-coins
   */
  async getSupportedCoins(request: SupportedCoinsRequest): Promise<SupportedCoinsResponse> {
    const { getSupportedCoins: moduleGetSupportedCoins } = await import('./modules/get-supported-coins');
    return moduleGetSupportedCoins(request, this.apiRequest);
  }

  /**
   * Validate Wallet Address
   * GET /api/info/wallet-validation
   */
  async validateWalletAddress(request: WalletValidationRequest): Promise<WalletValidationResponse> {
    const { validateWalletAddress: moduleValidateWalletAddress } = await import('./modules/validate-wallet-address');
    return moduleValidateWalletAddress(request, this.apiRequest);
  }
  // ========================================
  // WALLET ENDPOINT
  // ========================================

  /**
   * Retrieve Wallet Balance
   * POST /api/wallet/balance
   */
  async getWalletBalance(request: WalletBalanceRequest): Promise<WalletBalanceResponse> {
    const { getWalletBalance: moduleGetWalletBalance } = await import('./modules/get-wallet-balance');
    return moduleGetWalletBalance(request, this.apiRequest);
  }

  /**
   * Create a New Wallet
   * This method can work in two modes:
   * 1. Using CryptoWebAPI (default)
   * 2. Using local wallet generation (when useLocalGeneration is true)
   *
   * @param request - The wallet creation request parameters
   * @param useLocalGeneration - Whether to use local wallet generation instead of CryptoWebAPI
   * @returns Promise<CreateWalletResponse> - The created wallet details
   */
  async createWallet(
    request: CreateWalletRequest,
    useLocalGeneration: boolean = false
  ): Promise<CreateWalletResponse> {
    // Import the createWallet function from the module
    const { createWallet: moduleCreateWallet } = await import('./modules/create-wallet');

    // Call the module function with or without apiRequest based on useLocalGeneration
    return moduleCreateWallet(request, useLocalGeneration ? undefined : this.apiRequest);
  }

  /**
   * Send Raw Transaction
   * POST /api/wallet/send
   */
  async sendTransaction(request: SendTransactionRequest): Promise<SendTransactionResponse> {
    const { sendTransaction: moduleSendTransaction } = await import('./modules/send-transaction');
    return moduleSendTransaction(request, this.apiRequest);
  }

  /**
   * Generate Address from Mnemonic
   * POST /api/wallet/address-from-mnemonic
   */
  async generateAddressFromMnemonic(
    request: AddressFromMnemonicRequest
  ): Promise<AddressFromMnemonicResponse> {
    const { generateAddressFromMnemonic: moduleGenerateAddressFromMnemonic } = await import('./modules/generate-address-from-mnemonic');
    return moduleGenerateAddressFromMnemonic(request, this.apiRequest);
  }

  // ========================================
  // FEE DATA AND NONCE ENDPOINTS
  // ========================================

  /**
   * Get Fee Data
   * Retrieves current network fee information including gas price
   * GET /api/blockchain/feeData
   *
   * @param request - Fee data request parameters
   * @returns Promise<FeeDataResponse> - Current fee data for the network
   */
  async getFeeData(request: FeeDataRequest): Promise<FeeDataResponse> {
    const { getFeeData: moduleGetFeeData } = await import('./modules/get-fee-data');
    return moduleGetFeeData(request, this.apiRequest);
  }

  /**
   * Get Account Nonce
   * Retrieves the current nonce for an account address
   * GET /api/blockchain/nonce
   *
   * @param request - Account nonce request parameters
   * @returns Promise<AccountNonceResponse> - Current nonce for the address
   */
  async getAccountNonce(request: AccountNonceRequest): Promise<AccountNonceResponse> {
    const { getAccountNonce: moduleGetAccountNonce } = await import('./modules/get-account-nonce');
    return moduleGetAccountNonce(request, this.apiRequest);
  }

  // ========================================
  // TRANSACTION BUILDER
  // ========================================

  /**
   * Build Transaction (Create Raw Transaction)
   * This method builds a raw transaction using CryptoWebAPI for fee data and nonce
   * Note: Requires 'ethers' package to be installed for EVM-compatible networks (Ethereum, BNB)
   */
  async buildTransaction(request: TransactionBuilderRequest): Promise<TransactionBuilderResponse> {
    const { buildTransaction: moduleBuildTransaction } = await import('./modules/build-transaction');
    return moduleBuildTransaction(request, this.apiRequest);
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

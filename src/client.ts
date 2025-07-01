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
  BlockchainMetaRequest,
  BlockchainMetaResponse,
  TransactionBuilderRequest,
  TransactionBuilderResponse,
} from './types.js';
import { ApiRequest } from './lib/request.js';

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
    const { getTransaction: moduleGetTransaction } = await import('./modules/get-transaction/index.js');
    return moduleGetTransaction(request, this.apiRequest);
  }
  /**
   * List Transactions (7-Day History)
   * GET /api/blockchain/transactions
   */
  async listTransactions(request: ListTransactionsRequest): Promise<ListTransactionsResponse> {
    const { listTransactions: moduleListTransactions } = await import('./modules/list-transactions/index.js');
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
    const { getSupportedCoins: moduleGetSupportedCoins } = await import('./modules/get-supported-coins/index.js');
    return moduleGetSupportedCoins(request, this.apiRequest);
  }

  /**
   * Validate Wallet Address
   * GET /api/info/wallet-validation
   */
  async validateWalletAddress(request: WalletValidationRequest): Promise<WalletValidationResponse> {
    const { validateWalletAddress: moduleValidateWalletAddress } = await import('./modules/validate-wallet-address/index.js');
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
    const { getWalletBalance: moduleGetWalletBalance } = await import('./modules/get-wallet-balance/index.js');
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
    const { createWallet: moduleCreateWallet } = await import('./modules/create-wallet/index.js');

    // Call the module function with or without apiRequest based on useLocalGeneration
    return moduleCreateWallet(request, useLocalGeneration ? undefined : this.apiRequest);
  }

  /**
   * Send Raw Transaction
   * POST /api/wallet/send
   */
  async sendTransaction(request: SendTransactionRequest): Promise<SendTransactionResponse> {
    const { sendTransaction: moduleSendTransaction } = await import('./modules/send-transaction/index.js');
    return moduleSendTransaction(request, this.apiRequest);
  }

  /**
   * Generate Address from Mnemonic
   * POST /api/wallet/address-from-mnemonic
   */
  async generateAddressFromMnemonic(
    request: AddressFromMnemonicRequest
  ): Promise<AddressFromMnemonicResponse> {
    const { generateAddressFromMnemonic: moduleGenerateAddressFromMnemonic } = await import('./modules/generate-address-from-mnemonic/index.js');
    return moduleGenerateAddressFromMnemonic(request, this.apiRequest);
  }

  // ========================================
  // BLOCKCHAIN META ENDPOINT
  // ========================================

  /**
   * Get Blockchain Meta
   * Retrieves transaction metadata needed for building and signing transactions.
   * Provides current fee data, gas limits, chain ID, nonce, and balance information.
   * GET /api/blockchain/transaction-meta
   *
   * @param request - Blockchain meta request parameters
   * @returns Promise<BlockchainMetaResponse> - Transaction metadata including fee data, gas limits, chain ID, nonce, and balance
   */
  async getBlockchainMeta(request: BlockchainMetaRequest): Promise<BlockchainMetaResponse> {
    const { getBlockchainMeta: moduleGetBlockchainMeta } = await import('./modules/get-blockchain-meta/index.js');
    return moduleGetBlockchainMeta(request, this.apiRequest);
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
    const { buildTransaction: moduleBuildTransaction } = await import('./modules/build-transaction/index.js');
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

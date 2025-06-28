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
    const params = {
      network: request.network,
      transactionId: request.transactionId,
    };

    return this.apiRequest.makeRequest<GetTransactionResponse>(
      'GET',
      '/api/blockchain/transaction',
      undefined,
      { params }
    );
  }
  /**
   * List Transactions (7-Day History)
   * GET /api/blockchain/transactions
   */
  async listTransactions(request: ListTransactionsRequest): Promise<ListTransactionsResponse> {
    const params: any = {
      network: request.network,
    };

    // Add optional parameters if they exist
    if (request.address) params.address = request.address;
    if (request.fromAddress) params.fromAddress = request.fromAddress;
    if (request.toAddress) params.toAddress = request.toAddress;
    if (request.txType) params.txType = request.txType;
    if (request.tokenSymbol) params.tokenSymbol = request.tokenSymbol;

    // Value filters
    if (request.fromValue !== undefined) params.fromValue = request.fromValue;
    if (request.toValue !== undefined) params.toValue = request.toValue;
    if (request.minValueDecimal !== undefined) params.minValueDecimal = request.minValueDecimal;
    if (request.maxValueDecimal !== undefined) params.maxValueDecimal = request.maxValueDecimal;

    // Fee filters
    if (request.minFeeDecimal !== undefined) params.minFeeDecimal = request.minFeeDecimal;
    if (request.maxFeeDecimal !== undefined) params.maxFeeDecimal = request.maxFeeDecimal;

    // Date filters
    if (request.fromTimestamp) params.fromTimestamp = request.fromTimestamp;
    if (request.toTimestamp) params.toTimestamp = request.toTimestamp;
    if (request.startDate) params.startDate = request.startDate;
    if (request.endDate) params.endDate = request.endDate;

    // Sorting
    if (request.sortBy) params.sortBy = request.sortBy;
    if (request.sortOrder) params.sortOrder = request.sortOrder;

    // Pagination
    if (request.limit !== undefined) params.limit = request.limit;
    if (request.offset !== undefined) params.offset = request.offset;

    return this.apiRequest.makeRequest<ListTransactionsResponse>(
      'GET',
      '/api/blockchain/transactions',
      undefined,
      {
        params,
      }
    );
  }
  // ========================================
  // INFO ENDPOINT
  // ========================================
  /**
   * Get Supported Coins Metadata
   * GET /api/info/supported-coins
   */
  async getSupportedCoins(request: SupportedCoinsRequest): Promise<SupportedCoinsResponse> {
    const params: any = {};

    // Only add network parameter if provided
    if (request.network) {
      params.network = request.network;
    }

    return this.apiRequest.makeRequest<SupportedCoinsResponse>(
      'GET',
      '/api/info/supported-coins',
      undefined,
      {
        params,
      }
    );
  }

  /**
   * Validate Wallet Address
   * GET /api/info/wallet-validation
   */
  async validateWalletAddress(request: WalletValidationRequest): Promise<WalletValidationResponse> {
    const params = {
      network: request.network,
      address: request.address,
    };

    return this.apiRequest.makeRequest<any>('GET', '/api/info/wallet-validation', undefined, {
      params,
    });
  }
  // ========================================
  // WALLET ENDPOINT
  // ========================================

  /**
   * Retrieve Wallet Balance
   * POST /api/wallet/balance
   */
  async getWalletBalance(request: WalletBalanceRequest): Promise<WalletBalanceResponse> {
    const requestBody = {
      network: request.network,
      address: request.address,
      mode: request.mode || 'mainnet',
      ...(request.tokens && { tokens: request.tokens }),
    };

    return this.apiRequest.makeRequest<any>('POST', '/api/wallet/balance', requestBody);
  }

  /**
   * Create a New Wallet
   * GET /api/wallet/create
   */
  async createWallet(request: CreateWalletRequest): Promise<CreateWalletResponse> {
    const params = {
      network: request.network,
    };

    return this.apiRequest.makeRequest<any>('GET', '/api/wallet/create', undefined, {
      params,
    });
  }

  /**
   * Send Raw Transaction
   * POST /api/wallet/send
   */
  async sendTransaction(request: SendTransactionRequest): Promise<SendTransactionResponse> {
    const requestBody = {
      rawTx: request.rawTx,
      network: request.network,
      mode: request.mode || 'mainnet',
    };

    return this.apiRequest.makeRequest<any>('POST', '/api/wallet/send', requestBody);
  }

  /**
   * Generate Address from Mnemonic
   * POST /api/wallet/address-from-mnemonic
   */
  async generateAddressFromMnemonic(
    request: AddressFromMnemonicRequest
  ): Promise<AddressFromMnemonicResponse> {
    const requestBody = {
      network: request.network,
      mnemonic: request.mnemonic,
      mode: request.mode || 'mainnet',
    };

    return this.apiRequest.makeRequest<any>(
      'POST',
      '/api/wallet/address-from-mnemonic',
      requestBody
    );
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
    const params: any = {
      network: request.network,
    };

    if (request.mode) {
      params.mode = request.mode;
    }

    return this.apiRequest.makeRequest<FeeDataResponse>(
      'GET',
      '/api/blockchain/feeData',
      undefined,
      { params }
    );
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
    const params = {
      network: request.network,
      address: request.address,
      ...(request.mode && { mode: request.mode }),
    };

    return this.apiRequest.makeRequest<AccountNonceResponse>(
      'GET',
      '/api/blockchain/nonce',
      undefined,
      { params }
    );
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
    const { network } = request;

    // Check if this is an EVM-compatible network
    if (!this.isEvmNetwork(network)) {
      return this.buildNonEvmTransaction(request);
    }

    const {
      privateKey,
      receiver,
      value,
      mode = 'mainnet',
      contractAddress,
      contractDecimal,
    } = request;

    if (!privateKey || !receiver || !value) {
      throw new Error('Missing required fields: privateKey, receiver, or value');
    }

    // Try to import ethers - it should be installed by the user
    let ethers: any;
    try {
      // Use dynamic import with require() style to avoid TypeScript compile-time errors
      ethers = await Function('return import("ethers")')();
    } catch (error) {
      throw new Error(
        'ethers package is required for EVM transaction building. Please install it: npm install ethers'
      );
    }

    const fixedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

    // Create wallet without provider first
    const wallet = new ethers.Wallet(fixedPrivateKey);

    // Get nonce from CryptoWebAPI
    const nonceResponse = await this.getAccountNonce({
      network,
      address: wallet.address,
      mode,
    });

    if (!nonceResponse.success) {
      throw new Error(`Failed to get nonce: ${nonceResponse.message}`);
    }

    // Get fee data from CryptoWebAPI
    const feeDataResponse = await this.getFeeData({
      network,
      mode,
    });

    if (!feeDataResponse.success) {
      throw new Error(`Failed to get fee data: ${feeDataResponse.message}`);
    }

    const nonce = nonceResponse.data.nonce;
    const gasPrice = BigInt(feeDataResponse.data.gasPrice);

    // Determine chainId based on network and mode
    const chainId = this.getChainId(network, mode);

    const isToken = contractAddress && contractDecimal;
    let unsignedTx: any; // Using any to avoid ethers type dependency
    let gasLimit: bigint;

    if (isToken) {
      // ERC20/BEP20 Token transaction
      const TOKEN_ABI = ['function transfer(address to, uint256 amount) public returns (bool)'];

      const contract = new ethers.Contract(contractAddress, TOKEN_ABI);
      const amount = ethers.parseUnits(value.toString(), contractDecimal);

      const data = contract.interface.encodeFunctionData('transfer', [receiver, amount]);

      // Use a reasonable gas limit for token transfers
      // BNB Smart Chain typically uses less gas than Ethereum
      gasLimit = network === 'bnb' ? BigInt(60_000) : BigInt(100_000);

      unsignedTx = {
        to: contractAddress,
        data,
        value: 0,
        gasLimit,
        nonce,
        gasPrice,
        chainId,
      };
    } else {
      // Native token transaction (ETH, BNB)
      gasLimit = BigInt(21_000);
      unsignedTx = {
        to: receiver,
        value: ethers.parseEther(value.toString()),
        gasLimit,
        nonce,
        gasPrice,
        chainId,
      };
    }

    // Sign the transaction
    const rawTx = await wallet.signTransaction(unsignedTx);
    const fee = gasPrice * gasLimit;
    const estimatedFeeEth = ethers.formatEther(fee.toString());

    const responseData = {
      status: 'build' as const,
      type: isToken
        ? network === 'bnb'
          ? ('bep20' as const)
          : ('erc20' as const)
        : ('native' as const),
      from: wallet.address,
      to: unsignedTx.to as string,
      value: value.toString(),
      rawTx,
      gasPrice: gasPrice.toString(),
      gasLimit: gasLimit.toString(),
      estimatedFeeEth,
      nonce: String(nonce),
      chainId: String(chainId),
    };

    return {
      success: true,
      message: `Transaction built successfully for ${network} network`,
      network,
      data: responseData,
    };
  }

  /**
   * Helper method to get chainId based on network and mode
   */
  private getChainId(network: SupportedNetwork, mode: 'mainnet' | 'testnet'): bigint {
    const chainIds: Record<SupportedNetwork, { mainnet: bigint; testnet: bigint }> = {
      ethereum: { mainnet: 1n, testnet: 11155111n }, // Sepolia
      bnb: { mainnet: 56n, testnet: 97n }, // BSC Testnet
      bitcoin: { mainnet: 0n, testnet: 0n }, // Bitcoin doesn't use chainId, using 0 as placeholder
      tron: { mainnet: BigInt(0x2b6653dc), testnet: BigInt(0x94a9059e) }, // Tron mainnet and Nile testnet
    };

    return chainIds[network][mode];
  }

  /**
   * Helper method to check if network supports EVM-style transactions
   */
  private isEvmNetwork(network: SupportedNetwork): boolean {
    return network === 'ethereum' || network === 'bnb';
  }

  /**
   * Build Transaction for Non-EVM Networks (Bitcoin, Tron)
   * This is a placeholder - actual implementation would require network-specific libraries
   */
  private async buildNonEvmTransaction(
    request: TransactionBuilderRequest
  ): Promise<TransactionBuilderResponse> {
    const { network } = request;

    // For now, throw an error as non-EVM networks require specialized handling
    throw new Error(
      `Transaction building for ${network} network is not yet implemented. ` +
        `This network requires specialized libraries and handling.`
    );
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

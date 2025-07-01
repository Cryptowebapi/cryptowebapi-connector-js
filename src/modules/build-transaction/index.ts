import { TransactionBuilderRequest, TransactionBuilderResponse } from '../../types.js';
import { ApiRequest } from '../../lib/request.js';
import { TransactionBuilderFactory } from './factories/transaction-builder.factory.js';
import { BuildTransactionOptions } from './types/transaction-builder.types.js';

// Export types and interfaces for external use
export * from './interfaces/transaction-builder.interface.js';
export * from './types/transaction-builder.types.js';
export * from './factories/transaction-builder.factory.js';

// Export services for direct use if needed
export * from './services/ethereum-transaction.service.js';
export * from './services/bnb-transaction.service.js';
export * from './services/bitcoin-transaction.service.js';
export * from './services/tron-transaction.service.js';

/**
 * Build and sign a transaction for the specified network
 *
 * This function can work in two modes:
 * 1. Using CryptoWebAPI for nonce and fee data (when apiRequest is provided)
 * 2. Using local transaction building with default values (when apiRequest is not provided)
 *
 * @param request - The transaction builder request parameters
 * @param apiRequest - Optional API request instance for getting nonce and fee data
 * @returns Promise<TransactionBuilderResponse> - The built transaction details
 */
export async function buildTransaction(
  request: TransactionBuilderRequest,
  apiRequest?: ApiRequest
): Promise<TransactionBuilderResponse> {
  if (apiRequest) {
    // Use API mode for enhanced functionality
    return buildTransactionWithApi(request, apiRequest);
  } else {
    // Use local mode (offline)
    return buildTransactionLocally(request);
  }
}

/**
 * Build transaction using CryptoWebAPI for nonce and fee data
 */
async function buildTransactionWithApi(
  request: TransactionBuilderRequest,
  apiRequest: ApiRequest
): Promise<TransactionBuilderResponse> {
  const { network } = request;

  // Import required module dynamically
  const { getBlockchainMeta } = await import('../get-blockchain-meta/index.js');

  // Get wallet address from private key
  const walletAddress = await getAddressFromPrivateKey(request.privateKey, network);

  // Get blockchain metadata (nonce, fee data, etc.) from CryptoWebAPI
  const metaResponse = await getBlockchainMeta({
    network,
    address: walletAddress,
    mode: request.mode,
  }, apiRequest);

  if (!metaResponse.success) {
    throw new Error(`Failed to get blockchain metadata: ${metaResponse.message}`);
  }

  // Create enhanced options with API data
  const options: BuildTransactionOptions = {
    network: request.network,
    privateKey: request.privateKey,
    receiver: request.receiver,
    value: request.value,
    mode: request.mode,
    contractAddress: request.contractAddress,
    contractDecimal: request.contractDecimal,
    ...(metaResponse.data.nonce !== undefined && { nonce: metaResponse.data.nonce }),
    gasPrice: metaResponse.data.gasPrice,
    ...(metaResponse.data.maxFeePerGas && { maxFeePerGas: metaResponse.data.maxFeePerGas }),
    ...(metaResponse.data.maxPriorityFeePerGas && { maxPriorityFeePerGas: metaResponse.data.maxPriorityFeePerGas }),
  };

  // Use the factory to build transaction with API data
  const factory = new TransactionBuilderFactory();
  const service = await factory.getService(network);
  const result = await service.buildTransaction(options);

  return {
    success: true,
    message: `Transaction built successfully for ${network} network using API data`,
    network,
    data: {
      status: 'build' as const,
      type: result.type,
      from: result.from,
      to: result.to,
      value: result.value,
      rawTx: result.rawTx,
      gasPrice: result.gasPrice,
      gasLimit: result.gasLimit,
      estimatedFeeEth: result.estimatedFeeEth,
      nonce: result.nonce,
      chainId: result.chainId,
    },
  };
}

/**
 * Build transaction locally without API (offline mode)
 */
async function buildTransactionLocally(
  request: TransactionBuilderRequest
): Promise<TransactionBuilderResponse> {
  const { network } = request;

  if (!request.privateKey || !request.receiver || !request.value) {
    throw new Error('Missing required fields: privateKey, receiver, or value');
  }

  const options: BuildTransactionOptions = {
    network: request.network,
    privateKey: request.privateKey,
    receiver: request.receiver,
    value: request.value,
    mode: request.mode || 'mainnet',
    contractAddress: request.contractAddress,
    contractDecimal: request.contractDecimal,
  };

  const factory = new TransactionBuilderFactory();
  const service = await factory.getService(network);
  const result = await service.buildTransaction(options);

  return {
    success: true,
    message: `Transaction built successfully for ${network} network (local mode)`,
    network,
    data: {
      status: 'build' as const,
      type: result.type,
      from: result.from,
      to: result.to,
      value: result.value,
      rawTx: result.rawTx,
      gasPrice: result.gasPrice,
      gasLimit: result.gasLimit,
      estimatedFeeEth: result.estimatedFeeEth,
      nonce: result.nonce,
      chainId: result.chainId,
    },
  };
}

/**
 * Direct transaction building using the factory pattern
 * This is a more advanced API for users who want direct access to the services
 *
 * @param options - Transaction building options
 * @returns Promise containing transaction details
 */
export async function buildTransactionDirect(options: BuildTransactionOptions) {
  const factory = new TransactionBuilderFactory();
  const service = await factory.getService(options.network);
  return service.buildTransaction(options);
}

/**
 * Helper function to get address from private key
 */
async function getAddressFromPrivateKey(privateKey: string, network: string): Promise<string> {
  if (network === 'ethereum' || network === 'bnb') {
    // For EVM networks, use ethers.js
    try {
      const ethers = await Function('return import("ethers")')();
      const fixedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
      const wallet = new ethers.Wallet(fixedPrivateKey);
      return wallet.address;
    } catch (error) {
      throw new Error('ethers package is required to derive address from private key for EVM networks');
    }
  }
  
  // For other networks, would need specific implementations
  throw new Error(`Address derivation for ${network} network is not yet implemented`);
}

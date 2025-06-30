/**
 * Ethereum Transaction Builder Service
 * 
 * Handles transaction building for Ethereum network
 */

import { ITransactionBuilder } from '../interfaces/transaction-builder.interface';
import { BuildTransactionOptions, BuildTransactionResult } from '../types/transaction-builder.types';

export class EthereumTransactionService implements ITransactionBuilder {
  /**
   * Build and sign an Ethereum transaction
   */
  async buildTransaction(options: BuildTransactionOptions): Promise<BuildTransactionResult> {
    const { 
      privateKey, 
      receiver, 
      value, 
      mode = 'mainnet', 
      contractAddress, 
      contractDecimal,
      nonce = 0,
      gasPrice: providedGasPrice,
      gasLimit: providedGasLimit
    } = options;

    if (!privateKey || !receiver || !value) {
      throw new Error('Missing required fields: privateKey, receiver, or value');
    }

    // Try to import ethers
    let ethers: any;
    try {
      ethers = await Function('return import("ethers")')();
    } catch (error) {
      throw new Error(
        'ethers package is required for Ethereum transaction building. Please install it: npm install ethers'
      );
    }

    const fixedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    const wallet = new ethers.Wallet(fixedPrivateKey);

    // Use provided values or defaults
    const gasPrice = providedGasPrice ? BigInt(providedGasPrice) : BigInt('20000000000'); // 20 gwei default
    const chainId = mode === 'mainnet' ? 1n : 11155111n; // Ethereum mainnet or Sepolia

    const isToken = contractAddress && contractDecimal;
    let unsignedTx: any;
    let gasLimit: bigint;

    if (isToken) {
      // ERC20 Token transaction
      const TOKEN_ABI = ['function transfer(address to, uint256 amount) public returns (bool)'];
      const contract = new ethers.Contract(contractAddress, TOKEN_ABI);
      const amount = ethers.parseUnits(value.toString(), contractDecimal);
      const data = contract.interface.encodeFunctionData('transfer', [receiver, amount]);

      gasLimit = providedGasLimit ? BigInt(providedGasLimit) : BigInt(100_000);

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
      // Native ETH transaction
      gasLimit = providedGasLimit ? BigInt(providedGasLimit) : BigInt(21_000);
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

    return {
      network: 'ethereum',
      from: wallet.address,
      to: unsignedTx.to as string,
      value: value.toString(),
      rawTx,
      gasPrice: gasPrice.toString(),
      gasLimit: gasLimit.toString(),
      estimatedFeeEth,
      nonce: String(nonce),
      chainId: String(chainId),
      type: isToken ? 'erc20' : 'native',
    };
  }

  /**
   * Get the supported network
   */
  getSupportedNetwork(): string {
    return 'ethereum';
  }

  /**
   * Check if ethers.js is available
   */
  async isDependencyAvailable(): Promise<boolean> {
    try {
      await Function('return import("ethers")')();
      return true;
    } catch {
      return false;
    }
  }
}

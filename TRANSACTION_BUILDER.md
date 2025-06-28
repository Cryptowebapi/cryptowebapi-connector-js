# Transaction Builder Documentation

## Overview

The CryptoWebAPI Connector now includes transaction builder functionality that allows you to create raw transactions for EVM-compatible networks (Ethereum, BNB Smart Chain) using the CryptoWebAPI for fee data and nonce information instead of requiring direct RPC access.

## Features

- ✅ **EVM Transaction Building**: Support for Ethereum and BNB Smart Chain
- ✅ **Native Token Transactions**: ETH, BNB transfers
- ✅ **Token Transactions**: ERC20/BEP20 token transfers
- ✅ **Automatic Fee Data**: Fetches current gas prices from CryptoWebAPI
- ✅ **Automatic Nonce**: Retrieves account nonce from CryptoWebAPI
- ✅ **Network Detection**: Automatically detects network-specific parameters
- ⏳ **Future Support**: Bitcoin and Tron networks (coming soon)

## Prerequisites

For EVM transaction building, you need to install the `ethers` package:

```bash
npm install ethers
```

The ethers package is set as an optional peer dependency, so it won't be automatically installed.

## API Endpoints Used

### Fee Data Endpoint

- **GET** `/api/blockchain/feeData`
- Returns current gas price information for the network

### Account Nonce Endpoint

- **GET** `/api/blockchain/nonce`
- Returns the current nonce for a given address

## Methods

### `buildTransaction(request: TransactionBuilderRequest)`

Builds a raw transaction that can be sent using the existing `sendTransaction` method.

#### Parameters

```typescript
interface TransactionBuilderRequest {
  network: SupportedNetwork; // 'ethereum' | 'bnb' | 'bitcoin' | 'tron'
  privateKey: string; // Private key (with or without 0x prefix)
  receiver: string; // Recipient address
  value: string | number; // Amount to send
  mode?: 'mainnet' | 'testnet'; // Network mode (default: 'mainnet')
  contractAddress?: string; // Token contract address (for token transfers)
  contractDecimal?: number; // Token decimals (for token transfers)
}
```

#### Response

```typescript
interface TransactionBuilderResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  data: {
    status: 'build';
    type: 'erc20' | 'bep20' | 'native'; // Transaction type
    from: string; // Sender address
    to: string; // Recipient address
    value: string; // Amount being sent
    rawTx: string; // Signed raw transaction
    gasPrice: string; // Gas price used
    gasLimit: string; // Gas limit set
    estimatedFeeEth: string; // Estimated fee in ETH/BNB
    nonce: string; // Nonce used
    chainId: string; // Network chain ID
  };
}
```

### `getFeeData(request: FeeDataRequest)`

Retrieves current fee data for a network.

### `getAccountNonce(request: AccountNonceRequest)`

Retrieves the current nonce for an account.

## Usage Examples

### Native ETH Transaction

```typescript
import { CryptoWebApiClient } from 'cryptowebapi-connector-js';

const client = new CryptoWebApiClient({
  apiKey: 'your-api-key',
});

// Build native ETH transaction
const transaction = await client.buildTransaction({
  network: 'ethereum',
  privateKey: 'your-private-key',
  receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
  value: '0.001', // 0.001 ETH
  mode: 'testnet',
});

// Send the transaction
if (transaction.success) {
  const result = await client.sendTransaction({
    rawTx: transaction.data.rawTx,
    network: 'ethereum',
    mode: 'testnet',
  });
  console.log('Transaction sent:', result);
}
```

### ERC20 Token Transaction

```typescript
// Build ERC20 token transaction
const tokenTransaction = await client.buildTransaction({
  network: 'ethereum',
  privateKey: 'your-private-key',
  receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
  value: '100', // 100 tokens
  mode: 'mainnet',
  contractAddress: '0xA0b86a33E6141d82e97fB65fA4D26a39f2F3e8F3', // Token contract
  contractDecimal: 18, // Token decimals
});
```

### BNB Smart Chain Transaction

```typescript
// Build BNB transaction
const bnbTransaction = await client.buildTransaction({
  network: 'bnb',
  privateKey: 'your-private-key',
  receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
  value: '0.01', // 0.01 BNB
  mode: 'mainnet',
});
```

### BEP20 Token Transaction

```typescript
// Build BEP20 token transaction (e.g., USDT on BSC)
const bep20Transaction = await client.buildTransaction({
  network: 'bnb',
  privateKey: 'your-private-key',
  receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
  value: '100', // 100 USDT
  mode: 'mainnet',
  contractAddress: '0x55d398326f99059fF775485246999027B3197955', // USDT on BSC
  contractDecimal: 18,
});
```

## Network Support

| Network  | Native Tokens | Token Standard | Status         |
| -------- | ------------- | -------------- | -------------- |
| Ethereum | ETH           | ERC20          | ✅ Supported   |
| BNB      | BNB           | BEP20          | ✅ Supported   |
| Bitcoin  | BTC           | -              | ⏳ Coming Soon |
| Tron     | TRX           | TRC20          | ⏳ Coming Soon |

## Chain IDs

The transaction builder automatically uses the correct chain IDs:

| Network  | Mainnet | Testnet            |
| -------- | ------- | ------------------ |
| Ethereum | 1       | 11155111 (Sepolia) |
| BNB      | 56      | 97 (BSC Testnet)   |

## Gas Limits

Default gas limits are optimized for each transaction type:

- **Native transfers**: 21,000 gas
- **ERC20 transfers**: 100,000 gas
- **BEP20 transfers**: 60,000 gas (BSC uses less gas)

## Error Handling

Common errors and solutions:

- **"ethers package is required"**: Install ethers with `npm install ethers`
- **"Missing required fields"**: Ensure privateKey, receiver, and value are provided
- **"Transaction building for [network] is not yet implemented"**: Network not supported yet
- **"Failed to get nonce"**: Check if the address is valid and network is correct
- **"Failed to get fee data"**: Verify network and mode parameters

## Security Notes

⚠️ **Important Security Considerations:**

1. **Private Key Safety**: Never hardcode private keys in your source code
2. **Environment Variables**: Use environment variables for sensitive data
3. **Testnet First**: Always test on testnet before mainnet
4. **Validate Addresses**: Ensure recipient addresses are correct
5. **Amount Verification**: Double-check transaction amounts

## Complete Workflow

```typescript
import { CryptoWebApiClient } from 'cryptowebapi-connector-js';

async function completeTransactionWorkflow() {
  const client = new CryptoWebApiClient({
    apiKey: process.env.CRYPTO_API_KEY!, // Use environment variables
  });

  try {
    // 1. Build the transaction
    const transaction = await client.buildTransaction({
      network: 'ethereum',
      privateKey: process.env.PRIVATE_KEY!,
      receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
      value: '0.001',
      mode: 'testnet',
    });

    console.log('Transaction built:', transaction.data);

    // 2. Send the transaction
    if (transaction.success) {
      const result = await client.sendTransaction({
        rawTx: transaction.data.rawTx,
        network: 'ethereum',
        mode: 'testnet',
      });

      console.log('Transaction sent:', result.data.txId);

      // 3. Monitor the transaction (optional)
      if (result.success) {
        const txStatus = await client.getTransaction({
          network: 'ethereum',
          transactionId: result.data.txId,
        });

        console.log('Transaction status:', txStatus.data);
      }
    }
  } catch (error) {
    console.error('Transaction failed:', error);
  }
}
```

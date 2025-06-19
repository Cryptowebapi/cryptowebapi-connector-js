# CryptoWebAPI Connector JS

A robust TypeScript/JavaScript wrapper for **CryptoWebAPI** with built-in error handling, automatic retries, and full type safety. This connector provides easy access to blockchain transaction data.

## Features

- 🚀 **TypeScript Support** - Full type safety and IntelliSense support
- 🔄 **Automatic Retries** - Configurable retry logic for failed requests
- 🛡️ **Error Handling** - Comprehensive error types and handling
- ⚡ **Rate Limiting** - Built-in rate limit detection and handling
- 🔧 **Configurable** - Flexible configuration options
- 📦 **Lightweight** - Minimal dependencies
- 🧪 **Well Tested** - Comprehensive test coverage
- 🔗 **Real API Integration** - Built for https://api.cryptowebapi.com

## Installation

```bash
npm install cryptowebapi-connector-js
# or
yarn add cryptowebapi-connector-js
# or
pnpm add cryptowebapi-connector-js
```

## Quick Start

```typescript
import { CryptoWebApiClient } from 'cryptowebapi-connector-js';

// Initialize the client - automatically connects to api.cryptowebapi.com
const client = new CryptoWebApiClient({
  apiKey: 'your-api-key', // Get from cryptowebapi.com
  timeout: 10000, // optional, default: 10000ms
  retryAttempts: 3, // optional, default: 3
  retryDelay: 1000, // optional, default: 1000ms
});

// Get transaction details
async function getTransactionExample() {
  try {
    const response = await client.getTransaction({
      network: 'ethereum',
      transactionId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    });

    if (response.success && response.data) {
      console.log('Transaction Hash:', response.data.transactionHash);
      console.log('Block Number:', response.data.blockNumber);
      console.log('From:', response.data.from);
      console.log('To:', response.data.to);
      console.log('Value:', response.data.value);
      console.log('Status:', response.data.status);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## API Reference

### Client Configuration

```typescript
interface CryptoApiConfig {
  apiKey: string; // API key for authentication (required)
  timeout?: number; // Request timeout in milliseconds (default: 10000)
  retryAttempts?: number; // Number of retry attempts (default: 3)
  retryDelay?: number; // Delay between retries in milliseconds (default: 1000)
}
```

### 🔗 Blockchain Endpoints

#### `getTransaction(request: GetTransactionRequest)`

Get real-time transaction details.

```typescript
const transaction = await client.getTransaction({
  network: 'ethereum',
  transactionId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
});
```

**Parameters:**

- `network` (string): Blockchain network (e.g., 'ethereum', 'bitcoin', 'tron')
- `transactionId` (string): The unique identifier of the transaction to retrieve

**Response:**

```typescript
interface Transaction {
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gas: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  contractAddress: string | null;
  logs: TransactionLog[];
  status: string;
  effectiveGasPrice: string;
  type: string;
  timestamp: number;
}
```

### Configuration Management

#### `updateConfig(newConfig: Partial<CryptoApiConfig>)`

Update client configuration.

```typescript
client.updateConfig({
  timeout: 15000,
  retryAttempts: 5,
});
```

#### `getConfig()`

Get current configuration.

```typescript
const config = client.getConfig();
console.log('Current timeout:', config.timeout);
```

## Error Handling

The library provides specific error types for different scenarios:

```typescript
import {
  CryptoApiError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
} from 'cryptowebapi-connector-js';

try {
  const transaction = await client.getTransaction({ hash: '0x...' });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof NotFoundError) {
    console.error('Transaction not found:', error.message);
  } else {
    console.error('Unknown error:', error.message);
  }
}
```

## Response Format

All API methods return a standardized response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
```

## TypeScript Support

The library is written in TypeScript and provides full type definitions:

```typescript
import { Transaction, GetTransactionRequest, ApiResponse } from 'cryptowebapi-connector-js';

// Full type safety for all API responses
const handleTransaction = (tx: Transaction) => {
  console.log(`${tx.transactionHash}: ${tx.value} (${tx.status})`);
};
```

## Configuration Examples

### Basic Setup

```typescript
const client = new CryptoWebApiClient({
  apiKey: process.env.CRYPTOWEBAPI_KEY,
});
```

### Production Setup with Error Handling

```typescript
const client = new CryptoWebApiClient({
  apiKey: process.env.CRYPTOWEBAPI_KEY,
  timeout: 30000, // 30 seconds for production
  retryAttempts: 5, // More retries for production
  retryDelay: 2000, // 2 seconds between retries
});
```

## Real-World Examples

Check the `/examples` folder for complete usage examples:

- `basic-usage.ts` - Getting started example with transaction fetching

## Security Notes

- 🔐 Never expose API keys in client-side code
- 🔑 Store private keys securely (use environment variables)
- 🛡️ Validate all user inputs before sending to API
- 📝 Enable request logging for debugging (not in production)

## API Endpoints Summary

| Category       | Method                | Endpoint                           | Description                    |
| -------------- | --------------------- | ---------------------------------- | ------------------------------ |
| **Blockchain** | `getTransaction()`    | GET `/api/blockchain/transaction`  | Get transaction details        |
| **Blockchain** | `listTransactions()`  | GET `/api/blockchain/transactions` | List 7-day transaction history |
| **Info**       | `getSupportedCoins()` | GET `/api/info/supported-coins`    | Get supported coins metadata   |
| **Info**       | `validateWallet()`    | GET `/api/info/wallet-validation`  | Validate wallet address        |
| **Wallet**     | `getWalletBalance()`  | POST `/api/wallet/balance`         | Get wallet balance             |
| **Wallet**     | `createWallet()`      | GET `/api/wallet/create`           | Create new wallet              |
| **Wallet**     | `sendTransaction()`   | POST `/api/wallet/send`            | Send raw transaction           |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Build the project
npm run build

# Lint the code
npm run lint

# Format the code
npm run format
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [API Documentation](https://api.cryptowebapi.com/api/doc)
- 🌐 [CryptoWebAPI Website](https://www.cryptowebapi.com/)
- 🐛 [Issue Tracker](https://github.com/yourusername/cryptowebapi-connector-js/issues)

If you have any questions or issues, please [open an issue](https://github.com/yourusername/cryptowebapi-connector-js/issues) on GitHub.

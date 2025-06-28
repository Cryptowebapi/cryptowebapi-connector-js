# CryptoWebAPI Connector

A robust TypeScript/JavaScript wrapper for **CryptoWebAPI** with built-in error handling, automatic retries, and full type safety. This connector provides easy access to blockchain transaction data, wallet operations, and comprehensive crypto services.

## Features

- 🚀 **TypeScript Support** - Full type safety and IntelliSense support
- 🔄 **Automatic Retries** - Configurable retry logic for failed requests
- 🛡️ **Error Handling** - Comprehensive error types and handling
- ⚡ **Rate Limiting** - Built-in rate limit detection and handling
- 🔧 **Configurable** - Flexible configuration options
- 📦 **Lightweight** - Minimal dependencies
- 🧪 **Well Tested** - Comprehensive test coverage
- 🔗 **Real API Integration** - Built for https://api.cryptowebapi.com/api/doc
- 💰 **Multi-Network Support** - Ethereum, BSC, Bitcoin, Tron support
- 🏦 **Complete Wallet Operations** - Create, validate, balance, and transaction sending

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

// Example: Get transaction details
async function example() {
  try {
    const response = await client.getTransaction({
      network: 'ethereum',
      transactionId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    });

    if (response.success && response.data) {
      console.log('Transaction Hash:', response.data.hash);
      console.log('Block Number:', response.data.blockNumber);
      console.log('From:', response.data.fromAddress);
      console.log('To:', response.data.toAddress);
      console.log('Value:', response.data.valueDecimal);
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

### Supported Networks

```typescript
type SupportedNetwork = 'ethereum' | 'bnb' | 'bitcoin' | 'tron';
```

---

## � Available Endpoints

### �🔗 Blockchain Endpoints

#### `getTransaction(request: GetTransactionRequest)`

Get real-time transaction details.

```typescript
const transaction = await client.getTransaction({
  network: 'ethereum',
  transactionId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
});
```

**Parameters:**

- `network` (SupportedNetwork): Blockchain network
- `transactionId` (string): Transaction hash or ID

**Response:**

```typescript
interface TransactionData {
  hash: string;
  blockNumber: string;
  timestamp: string; // ISO date format
  fromAddress: string;
  toAddress: string;
  valueDecimal: string;
  feeDecimal: string;
  status: string; // "confirmed", "pending", "failed"
  tokenSymbol: string;
}
```

#### `listTransactions(request: ListTransactionsRequest)`

Get transaction history with filtering and pagination.

```typescript
const transactions = await client.listTransactions({
  network: 'ethereum',
  address: '0x742d35Cc6634C0532925a3b8D42C75e61e8B8635',
  limit: 50,
  sortBy: 'timestamp',
  sortOrder: 'desc',
});
```

**Parameters:**

- `network` (SupportedNetwork): Blockchain network
- `address?` (string): Wallet address to filter by
- `fromAddress?` (string): Filter by sender address
- `toAddress?` (string): Filter by recipient address
- `tokenSymbol?` (string): Filter by token symbol
- `minValueDecimal?` (number): Minimum transaction value
- `maxValueDecimal?` (number): Maximum transaction value
- `startDate?` (string): Start date filter (ISO format)
- `endDate?` (string): End date filter (ISO format)
- `sortBy?` ('timestamp' | 'valueDecimal' | 'feeDecimal'): Sort field
- `sortOrder?` ('asc' | 'desc'): Sort direction
- `limit?` (number): Number of results (max 1000)
- `offset?` (number): Pagination offset

---

### ℹ️ Info Endpoints

#### `getSupportedCoins(request: SupportedCoinsRequest)`

Get list of supported coins for a network.

```typescript
const supportedCoins = await client.getSupportedCoins({
  network: 'ethereum',
});
```

**Parameters:**

- `network?` (SupportedNetwork): Blockchain network

**Response:**

```typescript
interface CoinData {
  name: string; // Full name of the coin/token (e.g., "Tether USD (BSC)")
  shortName: string; // Short display name (e.g., "USDTBEP20")
  tag: string; // Tag/category identifier (e.g., "usdt_bep20")
  symbol: string; // Trading symbol (e.g., "USDT")
  type: string; // Type (e.g., "TOKEN", "COIN")
  decimals: number; // Decimal places (e.g., 6)
  contractAddress: string; // Smart contract address
  provider: string; // Data provider (e.g., "binance")
  usdRate: number; // Current USD exchange rate (e.g., 1)
  usdRateUpdatedAt: string; // Last rate update timestamp (ISO format)
  logo: string; // Base64 encoded logo image
}
```

#### `validateWalletAddress(request: WalletValidationRequest)`

Validate a wallet address for a specific network.

```typescript
const validation = await client.validateWalletAddress({
  network: 'ethereum',
  address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
});
```

**Response:**

```typescript
interface WalletValidationResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  address: string;
  valid: boolean;
}
```

---

### 💰 Wallet Endpoints

#### `getWalletBalance(request: WalletBalanceRequest)`

Get wallet balance including native currency and custom tokens.

```typescript
const balance = await client.getWalletBalance({
  network: 'ethereum',
  address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  mode: 'mainnet',
  tokens: [
    {
      name: 'USDCoin',
      symbol: 'USDC',
      address: '0xA0b86a33E6C4a7C737E49B0c2b8D9bB0a1b61E7F',
      decimals: 6,
      type: 'STABLECOIN',
      tag: 'usdc_erc20',
    },
  ],
});
```

**Parameters:**

- `network` (SupportedNetwork): Blockchain network
- `address` (string): Wallet address
- `mode?` ('mainnet' | 'testnet'): Network mode (default: 'mainnet')
- `tokens?` (TokenInfo[]): Custom tokens to check (max 20)

**Response:**

```typescript
interface BalanceData {
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
  isToken: boolean;
}
```

#### `createWallet(request: CreateWalletRequest)`

Create a new wallet for a specific network.

```typescript
const newWallet = await client.createWallet({
  network: 'ethereum',
});
```

**Response:**

```typescript
interface CreateWalletResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  address: string;
  key: string; // Private key
  mnemonic: string; // Seed phrase
}
```

⚠️ **Security Warning**: Store private keys and mnemonics securely!

#### `generateAddressFromMnemonic(request: AddressFromMnemonicRequest)`

Generate a wallet address from a mnemonic phrase.

```typescript
const addressFromMnemonic = await client.generateAddressFromMnemonic({
  network: 'ethereum',
  mnemonic: 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12',
  mode: 'mainnet',
});
```

**Parameters:**

- `network` (SupportedNetwork): Blockchain network
- `mnemonic` (string): BIP39 mnemonic phrase (12-24 words)
- `mode?` ('mainnet' | 'testnet'): Network mode (default: 'mainnet')

**Response:**

```typescript
interface AddressFromMnemonicResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  data: {
    network: SupportedNetwork;
    address: string; // Generated wallet address
    publicKey: string; // Public key
    privateKey: string; // Private key
    path: string; // BIP44 derivation path
  };
}
```

⚠️ **Security Warning**: Never expose private keys or use real mnemonics in examples!

#### `sendTransaction(request: SendTransactionRequest)`

Send a raw transaction to the blockchain.

```typescript
const result = await client.sendTransaction({
  network: 'bitcoin',
  rawTx: '0x7b226578616d706c65223a2261202d20726177202d207472616e73616374696f6e202d2064617461227d',
  mode: 'testnet',
});
```

**Parameters:**

- `rawTx` (string): Raw transaction data (hex encoded)
- `network` (SupportedNetwork): Blockchain network
- `mode?` ('mainnet' | 'testnet'): Network mode (default: 'mainnet')

**Response:**

```typescript
interface SendTransactionResponse {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  data: {
    txId: string; // Transaction ID/hash
  };
}
```

---

## 🛠️ Configuration & Utilities

### Update Configuration

```typescript
client.updateConfig({
  timeout: 15000,
  retryAttempts: 5,
});
```

### Get Current Configuration

````typescript
const config = client.getConfig();
console.log('Current timeout:', config.timeout);
---

## 🚨 Error Handling

The client includes comprehensive error handling with specific error types:

```typescript
import {
  CryptoApiError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  NotFoundError
} from 'cryptowebapi-connector-js';

try {
  const response = await client.getTransaction({
    network: 'ethereum',
    transactionId: 'invalid-hash',
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key:', error.message);
  } else if (error instanceof NotFoundError) {
    console.error('Transaction not found:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else {
    console.error('Unknown error:', error.message);
  }
}
````

### Error Types

- **`CryptoApiError`** - Base API error class
- **`AuthenticationError`** - Invalid API key (HTTP 401)
- **`NotFoundError`** - Resource not found (HTTP 404)
- **`RateLimitError`** - Rate limit exceeded (HTTP 429)
- **`NetworkError`** - Network connectivity issues

---

## 💡 Complete Example

```typescript
import { CryptoWebApiClient } from 'cryptowebapi-connector-js';

async function completeExample() {
  const client = new CryptoWebApiClient({
    apiKey: 'your-api-key-here',
  });

  try {
    // 1. Get supported coins
    const coins = await client.getSupportedCoins({ network: 'ethereum' });
    console.log(`Found ${coins.length} supported coins`);

    // Display some coin information
    coins.slice(0, 3).forEach((coin) => {
      console.log(`${coin.name} (${coin.symbol})`);
      console.log(`  Short Name: ${coin.shortName}`);
      console.log(`  Type: ${coin.type}, Decimals: ${coin.decimals}`);
      console.log(`  USD Rate: $${coin.usdRate}`);
      console.log(`  Provider: ${coin.provider}`);
      console.log(`  Contract: ${coin.contractAddress}`);
      console.log(`  Last Updated: ${coin.usdRateUpdatedAt}`);
    });

    // 2. Validate an address
    const validation = await client.validateWalletAddress({
      network: 'ethereum',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    });
    console.log(`Address is ${validation.valid ? 'valid' : 'invalid'}`);

    // 3. Get wallet balance
    const balance = await client.getWalletBalance({
      network: 'ethereum',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    });
    balance.data.forEach((token) => {
      console.log(`${token.symbol}: ${token.balance}`);
    });

    // 4. Get recent transactions
    const transactions = await client.listTransactions({
      network: 'ethereum',
      limit: 10,
      sortOrder: 'desc',
    });
    console.log(`Found ${transactions.data.length} transactions`);

    // 5. Create a new wallet (testnet recommended)
    const newWallet = await client.createWallet({ network: 'ethereum' });
    console.log(`New wallet created: ${newWallet.address}`);

    // 6. Generate address from mnemonic
    const addressFromMnemonic = await client.generateAddressFromMnemonic({
      network: 'ethereum',
      mnemonic:
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
      mode: 'testnet', // Use testnet for examples
    });
    console.log(`Address generated: ${addressFromMnemonic.data.address}`);
    console.log(`Derivation path: ${addressFromMnemonic.data.path}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

completeExample();
```

---

## 📊 Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  network: SupportedNetwork;
  transactionId?: string;
  data?: T;
}
```

- **`success`** - Indicates if the request was successful
- **`message`** - Human-readable status message
- **`network`** - The blockchain network used
- **`data`** - Response data (varies by endpoint)

---

## 📋 API Endpoints Summary

| Category       | Method                          | Endpoint                            | HTTP | Description                    |
| -------------- | ------------------------------- | ----------------------------------- | ---- | ------------------------------ |
| **Blockchain** | `getTransaction()`              | `/api/blockchain/transaction`       | GET  | Get transaction details        |
| **Blockchain** | `listTransactions()`            | `/api/blockchain/transactions`      | GET  | List 7-day transaction history |
| **Info**       | `getSupportedCoins()`           | `/api/info/supported-coins`         | GET  | Get supported coins metadata   |
| **Info**       | `validateWalletAddress()`       | `/api/info/wallet-validation`       | GET  | Validate wallet address        |
| **Wallet**     | `getWalletBalance()`            | `/api/wallet/balance`               | POST | Get wallet balance             |
| **Wallet**     | `createWallet()`                | `/api/wallet/create`                | GET  | Create new wallet              |
| **Wallet**     | `generateAddressFromMnemonic()` | `/api/wallet/address-from-mnemonic` | POST | Generate address from mnemonic |
| **Wallet**     | `sendTransaction()`             | `/api/wallet/send`                  | POST | Send raw transaction           |

---

## 🔧 Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

---

## 📝 Changelog

### v1.0.0 (Latest)

- ✅ Added all 7 core endpoints
- ✅ Full TypeScript support
- ✅ Comprehensive error handling
- ✅ Multi-network support (Ethereum, BSC, Bitcoin, Tron)
- ✅ Wallet operations (create, validate, balance, send)
- ✅ Transaction history with filtering
- ✅ Supported coins metadata
- ✅ Production-ready with tests

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

- **Documentation**: Check this README for comprehensive guides
- **API Documentation**: Visit [api.cryptowebapi.com/api/doc](https://api.cryptowebapi.com/api/doc)
- **Issues**: Report bugs on GitHub Issues

---

**Built with ❤️ for the blockchain community**

# CryptoWebAPI Connector

A robust TypeScript/JavaScript wrapper for **CryptoWebAPI** with modular architecture, full type safety, and comprehensive crypto services.

## 🚀 Features

- **Modular Architecture** - Import only what you need
- **TypeScript Support** - Full type safety and IntelliSense
- **Backward Compatible** - All existing APIs work unchanged
- **Local-First** - Wallet creation works offline
- **Multi-Network** - Ethereum, Bitcoin, BNB, Tron support
- **Tree-Shaking** - Optimal bundle sizes
- **Error Handling** - Comprehensive error types
- **Auto Retries** - Configurable retry logic

## 📦 Installation

```bash
npm install cryptowebapi-connector-js
```

## 💡 Usage Patterns

### 1. Traditional Client (Recommended)
```typescript
import { CryptoWebApiClient } from 'cryptowebapi-connector-js';

const client = new CryptoWebApiClient({ 
  apiKey: 'your-api-key' // Get from cryptowebapi.com
});

// Get transaction
const tx = await client.getTransaction({
  network: 'ethereum',
  transactionId: '0x...'
});

// Create wallet locally (no API needed)
const wallet = await client.createWallet({ network: 'ethereum' }, true);

// Get wallet balance
const balance = await client.getWalletBalance({
  network: 'ethereum',
  address: wallet.address
});
```

### 2. Direct Module Imports (Advanced)
```typescript
import { createWallet, getWalletBalance } from 'cryptowebapi-connector-js';

// Create wallet locally (no API needed)
const wallet = await createWallet({ network: 'ethereum' });

// Use API modules (need apiRequest instance)
const client = new CryptoWebApiClient({ apiKey: 'your-key' });
const apiRequest = (client as any).apiRequest;
const balance = await getWalletBalance(request, apiRequest);
```

### 3. Factory Pattern (Expert)
```typescript
import { WalletCreateFactory } from 'cryptowebapi-connector-js';

const factory = new WalletCreateFactory();
const service = await factory.getService('bitcoin');
const wallet = await service.createWallet('testnet');
```

## 📋 Available Modules

**API-Based Modules** (require CryptoWebAPI):
- `getTransaction` - Get transaction details
- `listTransactions` - List transactions with filters  
- `getSupportedCoins` - Get supported coin metadata
- `validateWalletAddress` - Validate wallet addresses
- `getWalletBalance` - Get wallet balances
- `sendTransaction` - Send raw transactions
- `generateAddressFromMnemonic` - Generate address from mnemonic
- `getFeeData` - Get network fee data
- `getAccountNonce` - Get account nonce
- `buildTransaction` - Build and sign transactions

**Local Modules** (work offline):
- `createWallet` - Create wallets locally (all networks)

## 🌐 Supported Networks

- **Ethereum** (mainnet/testnet)
- **Bitcoin** (mainnet/testnet)
- **BNB Smart Chain** (mainnet/testnet)
- **Tron** (mainnet/testnet)

## 📋 Optional Dependencies

For wallet creation, install only what you need:

```bash
# Ethereum/BNB
npm install ethers

# Bitcoin  
npm install bitcoinjs-lib @noble/secp256k1

# Tron
npm install ethers bip39
```

All other modules only need `axios` (already included).

## 🔧 Configuration

```typescript
const client = new CryptoWebApiClient({
  apiKey: 'your-api-key',     // Required
  timeout: 10000,             // Optional (default: 10000ms)
  retryAttempts: 3,           // Optional (default: 3)
  retryDelay: 1000,           // Optional (default: 1000ms)
});
```

## 📚 Examples

See the [examples](./examples/) folder for more comprehensive examples:
- `basic-usage.ts` - Basic API usage
- `modular-usage.ts` - Modular import patterns
- `transaction-builder.ts` - Transaction building

## 🛠️ Development

```bash
npm test          # Run tests
npm run build     # Build the package
npm run lint      # Lint code
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) file.

---

**Get your API key at [cryptowebapi.com](https://cryptowebapi.com) to start using the full API features!**

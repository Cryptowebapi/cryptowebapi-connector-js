# CryptoWebAPI Connector

A robust TypeScript/JavaScript wrapper for **CryptoWebAPI** with modular architecture, full type safety, and comprehensive crypto services.

## 🚀 Features

- **Modular Architecture** - Import only what you need
- **TypeScript Support** - Full type safety and IntelliSense
- **Offline-First** - Wallet creation and mnemonic recovery work completely offline
- **Multi-Network** - Ethereum, Bitcoin, BNB, Tron support
- **Modern ES Modules** - Full ES Module compatibility
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

// Create wallet offline (no API needed)
const wallet = await client.createWallet({ network: 'ethereum' }, true);

// Recover wallet from mnemonic offline (no API needed)
const recoveredWallet = await client.recoverFromMnemonic(
  'ethereum', 
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
);

// Get wallet balance
const balance = await client.getWalletBalance({
  network: 'ethereum',
  address: wallet.address
});

// Get blockchain metadata (fees, nonce, etc.)
const meta = await client.getBlockchainMeta({
  network: 'ethereum',
  address: wallet.address
});
```

### 2. Direct Module Imports (Advanced)
```typescript
import { 
  createWallet, 
  recoverFromMnemonic, 
  getWalletBalance, 
  ApiRequest 
} from 'cryptowebapi-connector-js';
// Create wallet offline (no API needed)
const wallet = await createWallet({ network: 'ethereum' });

// Recover wallet from mnemonic offline (no API needed)
const recoveredWallet = await recoverFromMnemonic(
  'bitcoin', 
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
);

// Use API modules with a custom API request instance
const apiRequest = new ApiRequest({ apiKey: 'your-key' });
const balance = await getWalletBalance(
  { network: 'ethereum', address: wallet.address },
  apiRequest
);
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
- `getBlockchainMeta` - Get blockchain metadata (fees, nonce, balance) **NEW**
- `buildTransaction` - Build and sign transactions

**Offline Modules** (work without API):
- `createWallet` - Create wallets offline (all networks)
- `recoverFromMnemonic` - Recover wallets from mnemonic phrases **NEW**

**Deprecated/Removed**:
- ~~`generateAddressFromMnemonic`~~ → Use `recoverFromMnemonic` instead
- ~~`getFeeData`~~ → Use `getBlockchainMeta` instead  
- ~~`getAccountNonce`~~ → Use `getBlockchainMeta` instead

## 🌐 Supported Networks

- **Ethereum** (mainnet/testnet)
- **Bitcoin** (mainnet/testnet)  
- **BNB Smart Chain** (mainnet/testnet)
- **Tron** (mainnet/testnet)

## � Optional Dependencies

For offline wallet operations, install only what you need:

```bash
# Ethereum/BNB support
npm install ethers

# Bitcoin support  
npm install bitcoinjs-lib bip39 bip32 tiny-secp256k1

# Tron support
npm install bip39 bip32 tiny-secp256k1 js-sha3

# All networks (full support)
npm install ethers bitcoinjs-lib bip39 bip32 tiny-secp256k1 js-sha3
```

> **Note**: API modules only require `axios` (already included). Optional dependencies are only needed for offline wallet operations.

## ✨ New Features (v3.0+)

### 🔑 Offline Mnemonic Recovery
```typescript
import { recoverFromMnemonic } from 'cryptowebapi-connector-js';

// Recover Ethereum wallet
const ethWallet = await recoverFromMnemonic(
  'ethereum',
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
);
// Returns: { network, address, publicKey, privateKey, path }

// Recover Bitcoin wallet  
const btcWallet = await recoverFromMnemonic(
  'bitcoin',
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  { mode: 'testnet' }
);

// Works with all supported networks: ethereum, bitcoin, bnb, tron
```

### 📊 Unified Blockchain Metadata
```typescript
// Replaces getFeeData + getAccountNonce with single endpoint
const meta = await client.getBlockchainMeta({
  network: 'ethereum',
  address: '0x...' // Optional - omit for fee data only
});

// Returns comprehensive blockchain data:
// { feeData, gasLimit, chainId, nonce?, balance? }
```

## 🔧 Configuration

```typescript
const client = new CryptoWebApiClient({
  apiKey: 'your-api-key',     // Required for API endpoints
  timeout: 10000,             // Optional (default: 10000ms)
  retryAttempts: 3,           // Optional (default: 3)
  retryDelay: 1000,           // Optional (default: 1000ms)
});
```

## 🎯 Migration Guide

### From v2.x to v3.x

```typescript
// ❌ Old way (v2.x)
const address = await client.generateAddressFromMnemonic({
  network: 'ethereum',
  mnemonic: 'your mnemonic here',
  index: 0
});

// ✅ New way (v3.x) - More comprehensive
const wallet = await client.recoverFromMnemonic(
  'ethereum',
  'your mnemonic here'
);
// Returns: { network, address, publicKey, privateKey, path }

// ❌ Old way (v2.x) - Separate calls
const feeData = await client.getFeeData({ network: 'ethereum' });
const nonce = await client.getAccountNonce({ 
  network: 'ethereum', 
  address: '0x...' 
});

// ✅ New way (v3.x) - Single call
const meta = await client.getBlockchainMeta({
  network: 'ethereum',
  address: '0x...'
});
// Returns: { feeData, gasLimit, chainId, nonce, balance }
```

## 🧪 Quick Test

Run the included demo to see all modules in action:

```bash
node demo.cjs
```

## 📚 Examples

See the [examples](./examples/) folder for comprehensive examples:
- `basic-usage.ts` - Complete usage guide (client, modules, transactions)  
- `build-transaction-modular.ts` - Advanced transaction building patterns

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

# 🎯 Modular Architecture Usage Guide

This document showcases the complete modular architecture of `cryptowebapi-connector-js` and demonstrates multiple usage patterns.

## 🏗️ Architecture Overview

The package supports **3 distinct usage patterns**:

1. **Traditional Client API** (Backward Compatible)
2. **Direct Module Imports** (New Modular Approach)
3. **Advanced Factory Pattern** (For Wallet Creation)

## 📦 Available Modules

### API-Based Modules
These modules require an API connection to CryptoWebAPI:

- `getTransaction` - Get transaction details
- `listTransactions` - List transactions with filters
- `getSupportedCoins` - Get supported coin metadata
- `validateWalletAddress` - Validate wallet addresses
- `getWalletBalance` - Get wallet balances
- `sendTransaction` - Send raw transactions
- `generateAddressFromMnemonic` - Generate address from mnemonic
- `getFeeData` - Get network fee data
- `getAccountNonce` - Get account nonce
- `buildTransaction` - Build and sign transactions (Hybrid: API + Local)

### Local Modules
These modules work completely offline:

- `createWallet` - Create wallets locally (supports all networks)

## 🚀 Usage Examples

### 1. Traditional Client API (Backward Compatible)

```typescript
import { CryptoWebApiClient } from 'cryptowebapi-connector-js';

const client = new CryptoWebApiClient({ apiKey: 'your-key' });

// All existing methods work exactly the same
const transaction = await client.getTransaction({ 
  network: 'ethereum', 
  transactionId: 'tx-id' 
});

const wallet = await client.createWallet({ network: 'ethereum' }, true); // local generation
const balance = await client.getWalletBalance({ 
  network: 'ethereum', 
  address: 'address' 
});
```

### 2. Direct Module Imports (New Modular Approach)

```typescript
import { 
  getTransaction,
  createWallet, 
  getWalletBalance,
  CryptoWebApiClient 
} from 'cryptowebapi-connector-js';

// For API-based modules, you need an apiRequest instance
const client = new CryptoWebApiClient({ apiKey: 'your-key' });
const apiRequest = (client as any).apiRequest;

// API-based modules (require apiRequest)
const transaction = await getTransaction({ 
  network: 'ethereum', 
  transactionId: 'tx-id' 
}, apiRequest);

const balance = await getWalletBalance({ 
  network: 'ethereum', 
  address: 'address' 
}, apiRequest);

// Local modules (no API call needed!)
const wallet = await createWallet({ network: 'ethereum' });
```

### 3. Advanced Factory Pattern (Wallet Creation Only)

```typescript
import { WalletCreateFactory } from 'cryptowebapi-connector-js';

const factory = new WalletCreateFactory();
const service = await factory.getService('bitcoin');
const wallet = await service.createWallet('testnet');
```

## 🎯 Complete Workflow Examples

### Multi-Network Wallet Creation (Offline)

```typescript
import { createWallet } from 'cryptowebapi-connector-js';

const networks = ['ethereum', 'bitcoin', 'bnb', 'tron'] as const;

// Create all wallets in parallel - completely offline!
const wallets = await Promise.all(
  networks.map(network => createWallet({ network }))
);

wallets.forEach((wallet, i) => {
  console.log(`${networks[i]}: ${wallet.address}`);
});
```

### Complete Transaction Building Workflow

```typescript
import { 
  getFeeData, 
  getAccountNonce, 
  buildTransaction, 
  sendTransaction,
  CryptoWebApiClient
} from 'cryptowebapi-connector-js';

const client = new CryptoWebApiClient({ apiKey: 'your-key' });
const apiRequest = (client as any).apiRequest;

// 1. Get fee data
const feeData = await getFeeData({ network: 'ethereum' }, apiRequest);

// 2. Get nonce
const nonceData = await getAccountNonce({ 
  network: 'ethereum', 
  address: 'your-address' 
}, apiRequest);

// 3. Build transaction (hybrid: API data + local signing)
const transaction = await buildTransaction({
  network: 'ethereum',
  privateKey: 'your-private-key',
  receiver: 'receiver-address',
  value: '0.1'
}, apiRequest);

// 4. Send transaction
const result = await sendTransaction({
  network: 'ethereum',
  rawTx: transaction.data.rawTx
}, apiRequest);
```

### Chained Wallet Operations

```typescript
import { 
  createWallet, 
  validateWalletAddress, 
  generateAddressFromMnemonic,
  CryptoWebApiClient
} from 'cryptowebapi-connector-js';

const client = new CryptoWebApiClient({ apiKey: 'your-key' });
const apiRequest = (client as any).apiRequest;

// 1. Create wallet locally
const newWallet = await createWallet({ network: 'ethereum' });

// 2. Validate the created address
const validation = await validateWalletAddress({
  network: 'ethereum',
  address: newWallet.address
}, apiRequest);

// 3. Recreate address from mnemonic (should match)
const recreatedAddress = await generateAddressFromMnemonic({
  network: 'ethereum',
  mnemonic: newWallet.mnemonic,
  mode: 'mainnet'
}, apiRequest);

console.log('Addresses match:', 
  recreatedAddress.data?.address?.toLowerCase() === newWallet.address.toLowerCase()
);
```

## 🔧 Dependencies by Module

### Wallet Creation Services
- **Ethereum/BNB**: `npm install ethers`
- **Bitcoin**: `npm install bitcoinjs-lib @noble/secp256k1`
- **Tron**: `npm install ethers bip39`

### All Other Modules
- Only `axios` (already included in the package)

## 📦 Bundle Optimization

Thanks to the modular structure, you can import only what you need:

```typescript
// Minimal - only wallet creation (smallest bundle)
import { createWallet } from 'cryptowebapi-connector-js';

// Medium - specific API functions
import { getTransaction, getWalletBalance } from 'cryptowebapi-connector-js';

// Full - complete client (largest bundle)
import { CryptoWebApiClient } from 'cryptowebapi-connector-js';
```

## ✅ Benefits

1. **🎯 Tree-Shaking**: Import only what you need
2. **🔧 Flexibility**: Choose your preferred usage pattern
3. **📦 Dependency Management**: Install optional packages only when needed
4. **🧪 Testability**: Each module is independently testable
5. **📈 Scalability**: Easy to add new modules
6. **🔄 Backward Compatibility**: All existing APIs work unchanged
7. **⚡ Performance**: Smaller bundles, faster loading
8. **🎨 Clean Architecture**: Clear separation of concerns

## 🎉 Summary

The modular architecture makes `cryptowebapi-connector-js` suitable for any project:

- **Beginners**: Use the traditional client - everything just works
- **Intermediate**: Use modular imports for optimized bundles
- **Advanced**: Use factory patterns for maximum control

Choose the approach that best fits your needs! 🚀

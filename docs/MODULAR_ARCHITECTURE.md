# 🎯 Modular Architecture

This package now supports a **fully modular architecture** with backward compatibility.

## 📦 Usage Patterns

### 1. Traditional Client (Backward Compatible)
```typescript
import { CryptoWebApiClient } from 'cryptowebapi-connector-js';
const client = new CryptoWebApiClient({ apiKey: 'your-key' });
const wallet = await client.createWallet({ network: 'ethereum' }, true);
```

### 2. Direct Module Imports (New)
```typescript
import { createWallet, getWalletBalance } from 'cryptowebapi-connector-js';
const wallet = await createWallet({ network: 'ethereum' }); // No API needed!
const balance = await getWalletBalance(request, apiRequest);
```

### 3. Factory Pattern (Advanced)
```typescript
import { WalletCreateFactory } from 'cryptowebapi-connector-js';
const factory = new WalletCreateFactory();
const service = await factory.getService('bitcoin');
const wallet = await service.createWallet('testnet');
```

## 🚀 Available Modules

**API-Based Modules** (require CryptoWebAPI):
- `getTransaction`, `listTransactions`, `getSupportedCoins`
- `validateWalletAddress`, `getWalletBalance`, `sendTransaction`
- `generateAddressFromMnemonic`, `getFeeData`, `getAccountNonce`
- `buildTransaction` (hybrid: API + local signing)

**Local Modules** (work offline):
- `createWallet` (supports Ethereum, Bitcoin, BNB, Tron)

## ✅ Benefits

- **Tree-shaking** - Import only what you need
- **Backward compatible** - All existing APIs work unchanged  
- **Local-first** - Wallet creation works offline
- **Optional dependencies** - Install only what you use
- **TypeScript** - Full type safety
- **Clean architecture** - Modular and testable

## 🌐 Networks

All modules support: Ethereum, Bitcoin, BNB Smart Chain, Tron (mainnet/testnet)

## 📋 Optional Dependencies

For wallet creation:
- **Ethereum/BNB**: `npm install ethers`
- **Bitcoin**: `npm install bitcoinjs-lib @noble/secp256k1`  
- **Tron**: `npm install ethers bip39`

All other modules only need `axios` (already included).

---

**The package is production-ready with full modular support!** 🎉

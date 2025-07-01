#!/usr/bin/env node

/**
 * CryptoWebAPI Connector - Demo & Test Suite
 * 
 * This unified demo shows all features and tests the modular architecture.
 * Works with both built package and development source.
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🚀 CryptoWebAPI Connector - Unified Demo\n');

// Check package info
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
console.log(`📦 Package: ${packageJson.name} v${packageJson.version}`);
console.log(`📄 Description: ${packageJson.description}\n`);

// Check build status
const distExists = existsSync(join(__dirname, 'dist'));
const hasIndexJs = existsSync(join(__dirname, 'dist', 'index.js'));
const hasEsmJs = existsSync(join(__dirname, 'dist', 'index.esm.js'));
const hasTypes = existsSync(join(__dirname, 'dist', 'index.d.ts'));

console.log('🏗️  Build Status:');
console.log(`  • dist/ directory: ${distExists ? '✅' : '❌'}`);
console.log(`  • CommonJS: ${hasIndexJs ? '✅' : '❌'}`);
console.log(`  • ES Modules: ${hasEsmJs ? '✅' : '❌'}`);
console.log(`  • TypeScript types: ${hasTypes ? '✅' : '❌'}`);

if (distExists) {
  const distFiles = readdirSync(join(__dirname, 'dist'));
  console.log(`  • Total files: ${distFiles.length}`);
}

console.log('\n🧩 Modular Architecture:');
console.log('  This package uses a modular architecture where you only install what you need.\n');

// Available modules
console.log('📚 Available Modules:');
console.log('  • create-wallet - Create crypto wallets offline');
console.log('  • build-transaction - Build transactions for signing');
console.log('  • get-supported-coins - List supported cryptocurrencies');
console.log('  • get-wallet-balance - Check wallet balances');
console.log('  • get-transaction - Fetch transaction details');
console.log('  • list-transactions - List wallet transactions');
console.log('  • send-transaction - Broadcast signed transactions');
console.log('  • validate-wallet-address - Validate addresses');
console.log('  • get-fee-data - Get network fee estimates');
console.log('  • get-account-nonce - Get account nonce for transactions');
console.log('  • generate-address-from-mnemonic - Derive addresses from seed\n');

// Installation instructions
console.log('📦 Installation:');
console.log('  npm install cryptowebapi-connector-js\n');

console.log('💡 Usage Examples:');
console.log('  // ESM (recommended)');
console.log('  import { createWallet, getSupportedCoins } from "cryptowebapi-connector-js";');
console.log('  ');
console.log('  // CommonJS');
console.log('  const { createWallet, getSupportedCoins } = require("cryptowebapi-connector-js");');
console.log('  ');
console.log('  // Full client (for API calls)');
console.log('  import { CryptoWebApiClient } from "cryptowebapi-connector-js";');
console.log('  const client = new CryptoWebApiClient("your-api-key");\n');

// Optional dependencies per network
console.log('🔧 Optional Dependencies by Network:');
console.log('  • Ethereum/BNB: npm install ethers');
console.log('  • Bitcoin: npm install bitcoinjs-lib @noble/secp256k1');
console.log('  • Tron: npm install ethers bip39\n');

// Test the package if built
if (hasIndexJs) {
  console.log('🧪 Testing Built Package...\n');
  
  try {
    // Try to load the built package
    const pkg = await import(`./dist/index.js`);
    
    console.log('✅ Package loaded successfully!');
    console.log(`  • Exported functions: ${Object.keys(pkg).length}`);
    console.log(`  • Available: ${Object.keys(pkg).join(', ')}\n`);
    
    // Test some basic functionality
    if (pkg.getSupportedCoins) {
      console.log('🪙 Testing getSupportedCoins...');
      try {
        const coins = await pkg.getSupportedCoins();
        console.log(`  ✅ Success: Found ${coins.length} supported coins`);
        console.log(`  • Examples: ${coins.slice(0, 3).map(c => c.symbol).join(', ')}`);
      } catch (error) {
        console.log(`  ⚠️  Note: ${error.message.includes('API key') ? 'API key required for live data' : error.message}`);
      }
    }
    
    if (pkg.createWallet) {
      console.log('\n💰 Testing wallet creation (offline)...');
      console.log('  • Bitcoin wallet creation requires: bitcoinjs-lib @noble/secp256k1');
      console.log('  • Ethereum wallet creation requires: ethers');
      console.log('  • Install dependencies to test wallet creation');
    }
    
  } catch (error) {
    console.log(`⚠️  Package build has issues: ${error.message}`);
    console.log(`  • This is normal during development`);
    console.log(`  • Run "npm run build" to rebuild`);
  }
} else {
  console.log('ℹ️  Package not built yet. Run "npm run build" to build the package.\n');
  
  console.log('🔧 Development Commands:');
  console.log('  • npm run build - Build the package');
  console.log('  • npm test - Run tests');
  console.log('  • npm run dev - Watch mode for development');
  console.log('  • npm run lint - Check code quality');
}

console.log('\n📖 More Information:');
console.log(`  • Repository: ${packageJson.repository.url}`);
console.log(`  • Homepage: ${packageJson.homepage}`);
console.log(`  • Documentation: ./docs/`);
console.log(`  • Examples: ./examples/`);

console.log('\n✨ Happy coding!\n');

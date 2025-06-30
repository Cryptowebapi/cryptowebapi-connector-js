/**
 * Build Transaction Example
 * 
 * This example demonstrates how to use the new modular build-transaction structure
 * which follows the same pattern as create-wallet module.
 */

import { buildTransaction, buildTransactionDirect, TransactionBuilderFactory } from '../src/modules/build-transaction';
import { ApiRequest } from '../src/lib/request';

async function exampleBuildTransaction() {
  console.log('🔧 Build Transaction Module Examples\n');

  // Example 1: Using buildTransaction with API (hybrid mode)
  console.log('1️⃣ Using buildTransaction with API for nonce and fee data:');
  try {
    const apiRequest = new ApiRequest({ apiKey: 'your-api-key' });
    
    const result = await buildTransaction({
      network: 'ethereum',
      privateKey: '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
      receiver: '0x742d35Cc6631C0532925a3b8D21B1c12345abcde',
      value: '0.1',
      mode: 'testnet'
    }, apiRequest);
    
    console.log('✅ API Mode Result:', result.success ? 'SUCCESS' : 'FAILED');
    console.log('📊 Transaction Hash:', result.data?.rawTx?.substring(0, 20) + '...');
  } catch (error) {
    console.log('⚠️  API Mode requires ethers.js and valid API key');
  }

  console.log('');

  // Example 2: Using buildTransaction without API (local/offline mode)
  console.log('2️⃣ Using buildTransaction in local/offline mode:');
  try {
    const result = await buildTransaction({
      network: 'ethereum',
      privateKey: '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
      receiver: '0x742d35Cc6631C0532925a3b8D21B1c12345abcde',
      value: '0.1',
      mode: 'testnet'
    }); // No apiRequest = local mode
    
    console.log('✅ Local Mode Result:', result.success ? 'SUCCESS' : 'FAILED');
    console.log('📊 Transaction Hash:', result.data?.rawTx?.substring(0, 20) + '...');
  } catch (error) {
    console.log('⚠️  Local Mode requires ethers.js:', error.message);
  }

  console.log('');

  // Example 3: Using buildTransactionDirect (advanced API)
  console.log('3️⃣ Using buildTransactionDirect (advanced API):');
  try {
    const result = await buildTransactionDirect({
      network: 'ethereum',
      privateKey: '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
      receiver: '0x742d35Cc6631C0532925a3b8D21B1c12345abcde',
      value: '0.1',
      mode: 'testnet',
      nonce: 42,
      gasPrice: '20000000000',
      gasLimit: '21000'
    });
    
    console.log('✅ Direct Mode Result: SUCCESS');
    console.log('📊 From:', result.from);
    console.log('📊 To:', result.to);
    console.log('📊 Value:', result.value + ' ETH');
    console.log('📊 Gas Price:', result.gasPrice + ' wei');
  } catch (error) {
    console.log('⚠️  Direct Mode requires ethers.js:', error.message);
  }

  console.log('');

  // Example 4: Using TransactionBuilderFactory directly
  console.log('4️⃣ Using TransactionBuilderFactory directly:');
  try {
    const factory = new TransactionBuilderFactory();
    console.log('🏭 Factory created successfully');
    console.log('📋 Supported networks:', factory.getSupportedNetworks().join(', '));
    console.log('✅ Network ethereum supported:', factory.isNetworkSupported('ethereum'));
    console.log('✅ Network bitcoin supported:', factory.isNetworkSupported('bitcoin'));
    
    // Try to get a service
    const ethereumService = await factory.getService('ethereum');
    console.log('🔧 Ethereum service loaded:', ethereumService.getSupportedNetwork());
    
    const dependencyAvailable = await ethereumService.isDependencyAvailable();
    console.log('📦 Ethereum dependencies available:', dependencyAvailable);
    
  } catch (error) {
    console.log('⚠️  Factory requires dependencies:', error.message);
  }

  console.log('\n🎯 Summary:');
  console.log('✅ build-transaction now follows the same modular structure as create-wallet');
  console.log('✅ Supports both API-enhanced and local/offline modes');
  console.log('✅ Factory pattern for direct service access');
  console.log('✅ Individual services for each network');
  console.log('✅ Type-safe interfaces and comprehensive error handling');
  console.log('✅ Optional dependencies with clear error messages');
}

// Run the example
exampleBuildTransaction().catch(console.error);

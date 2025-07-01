/**
 * Test script for the new recoverFromMnemonic function
 */

import { recoverFromMnemonic } from './dist/index.js';

async function testRecoverFromMnemonic() {
  const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
  
  console.log('Testing recoverFromMnemonic function...\n');
  
  try {
    // Test Ethereum
    console.log('Testing Ethereum...');
    const ethResult = await recoverFromMnemonic('ethereum', testMnemonic);
    console.log('Ethereum result:', ethResult);
    console.log('');
    
    // Test Bitcoin
    console.log('Testing Bitcoin...');
    const btcResult = await recoverFromMnemonic('bitcoin', testMnemonic);
    console.log('Bitcoin result:', btcResult);
    console.log('');
    
    // Test BNB
    console.log('Testing BNB...');
    const bnbResult = await recoverFromMnemonic('bnb', testMnemonic);
    console.log('BNB result:', bnbResult);
    console.log('');
    
    // Test Tron
    console.log('Testing Tron...');
    const tronResult = await recoverFromMnemonic('tron', testMnemonic);
    console.log('Tron result:', tronResult);
    console.log('');
    
    console.log('All tests completed successfully! ✅');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testRecoverFromMnemonic();

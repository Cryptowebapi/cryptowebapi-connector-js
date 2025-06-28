import { CryptoWebApiClient } from '../src/client';

// Example usage of the transaction builder
async function exampleTransactionBuilder() {
  // Initialize the client
  const client = new CryptoWebApiClient({
    apiKey: 'your-api-key-here',
  });

  try {
    // Example 1: Build native ETH transaction
    const nativeTransaction = await client.buildTransaction({
      network: 'ethereum',
      privateKey: 'your-private-key-here',
      receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
      value: '0.001', // 0.001 ETH
      mode: 'testnet', // or 'mainnet'
    });

    console.log('Native ETH Transaction:', nativeTransaction);

    // Example 2: Build ERC20 token transaction
    const tokenTransaction = await client.buildTransaction({
      network: 'ethereum',
      privateKey: 'your-private-key-here',
      receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
      value: '100', // 100 tokens
      mode: 'testnet',
      contractAddress: '0xA0b86a33E6141d82e97fB65fA4D26a39f2F3e8F3', // Example token contract
      contractDecimal: 18,
    });

    console.log('ERC20 Token Transaction:', tokenTransaction);

    // Example 3: Build BNB Smart Chain transaction
    const bnbTransaction = await client.buildTransaction({
      network: 'bnb',
      privateKey: 'your-private-key-here',
      receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
      value: '0.01', // 0.01 BNB
      mode: 'mainnet',
    });

    console.log('BNB Transaction:', bnbTransaction);

    // After building the transaction, you can send it using the existing sendTransaction method
    if (nativeTransaction.success) {
      const sendResult = await client.sendTransaction({
        rawTx: nativeTransaction.data.rawTx,
        network: 'ethereum',
        mode: 'testnet',
      });
      console.log('Transaction sent:', sendResult);
    }
  } catch (error) {
    console.error('Error building transaction:', error);
  }
}

// Example usage of fee data and nonce endpoints
async function exampleFeeDataAndNonce() {
  const client = new CryptoWebApiClient({
    apiKey: 'your-api-key-here',
  });

  try {
    // Get current fee data
    const feeData = await client.getFeeData({
      network: 'ethereum',
      mode: 'mainnet',
    });
    console.log('Current fee data:', feeData);

    // Get account nonce
    const nonce = await client.getAccountNonce({
      network: 'ethereum',
      address: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
      mode: 'mainnet',
    });
    console.log('Account nonce:', nonce);
  } catch (error) {
    console.error('Error getting fee data or nonce:', error);
  }
}

// Export examples
export { exampleTransactionBuilder, exampleFeeDataAndNonce };

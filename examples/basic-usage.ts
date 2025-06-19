import { CryptoWebApiClient } from '../src';

async function main() {
  // Initialize the client
  const client = new CryptoWebApiClient({
    apiKey: 'YOUR_API_KEY', // Replace with your actual API key
  });
  try {
    // Get transaction details
    const response = await client.getTransaction({
      network: 'ethereum',
      transactionId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    });

    if (response.success) {
      console.log('Transaction found!', response.data);
    } else {
      console.log('Error:', response.message);
    }

    // List transactions with filters
    const transactions = await client.listTransactions({
      network: 'ethereum',
      limit: 10,
      sortBy: 'timestamp',
      sortOrder: 'desc',
    });

    if (transactions.success) {
      console.log('Transactions found!', transactions.data.length, 'results');
    } else {
      console.log('Error:', transactions.message);
    }

    // Get supported coins for a network
    const supportedCoins = await client.getSupportedCoins({
      network: 'ethereum',
    });
    if (supportedCoins.success) {
      console.log('Supported coins:', supportedCoins.data.length, 'coins found');
      // Show first few coins as example
      supportedCoins.data.slice(0, 3).forEach((coin) => {
        console.log(`- ${coin.symbol} (${coin.name}) - Type: ${coin.type}`);
      });
    } else {
      console.log('Error:', supportedCoins.message);
    }

    // Validate a wallet address
    const validationResult = await client.validateWalletAddress({
      network: 'ethereum',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Example Ethereum address
    });

    if (validationResult.success) {
      console.log(
        `Address validation: ${validationResult.address} is ${validationResult.valid ? 'valid' : 'invalid'}`
      );
    } else {
      console.log('Validation error:', validationResult.message);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

// Run the example
main();

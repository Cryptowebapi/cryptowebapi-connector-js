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
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

// Run the example
main();

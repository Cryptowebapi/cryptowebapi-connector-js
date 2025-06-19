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

    // Get wallet balance
    const walletBalance = await client.getWalletBalance({
      network: 'ethereum',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      mode: 'mainnet',
      tokens: [
        {
          name: 'USDCoin',
          symbol: 'USDC',
          address: '0xA0b86a33E6C4a7C737E49B0c2b8D9bB0a1b61E7F',
          decimals: 6,
          type: 'STABLECOIN',
          tag: 'usdc_erc20',
        },
      ],
    });

    if (walletBalance.success) {
      console.log('Wallet balance retrieved!');
      walletBalance.data.forEach((balance) => {
        console.log(`- ${balance.symbol}: ${balance.balance} (${balance.name})`);
      });
    } else {
      console.log('Balance error:', walletBalance.message);
    }

    // Create a new wallet
    const newWallet = await client.createWallet({
      network: 'ethereum',
    });

    if (newWallet.success) {
      console.log('New wallet created!');
      console.log(`Address: ${newWallet.address}`);
      console.log(`Private Key: ${newWallet.key.substring(0, 10)}...`); // Only show first 10 chars for security
      console.log(`Mnemonic: ${newWallet.mnemonic.split(' ').slice(0, 3).join(' ')}...`); // Only show first 3 words
    } else {
      console.log('Wallet creation error:', newWallet.message);
    }

    // Send a raw transaction (example with a sample raw transaction)
    const sendResult = await client.sendTransaction({
      network: 'bitcoin',
      rawTx:
        '0x7b226578616d706c65223a2261202d20726177202d207472616e73616374696f6e202d2064617461227d',
      mode: 'testnet',
    });

    if (sendResult.success) {
      console.log('Transaction sent successfully!');
      console.log(`Transaction ID: ${sendResult.data.txId}`);
    } else {
      console.log('Send error:', sendResult.message);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

// Run the example
main();

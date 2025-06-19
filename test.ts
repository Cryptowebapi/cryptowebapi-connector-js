import { CryptoWebApiClient } from './dist/index.js';

async function getTransaction() {
  const client = new CryptoWebApiClient({
    apiKey: 'cc608a05-d748-4178-9b3c-e9f94375f806',
    baseUrl: 'https://api.example.com', // Test base URL - gerçek API yerine
  });

  try {
    const data = await client.getTransaction({
      network: 'ethereum',
      transactionId: '0x4974fa6ad89ec19af46201c742375f1bafe193ed3288076ca156024a1152ec72',
    });
    console.log('data :>> ', data);
  } catch (error) {
    console.error('Error fetching transaction details:', { error });
  }
}

getTransaction();

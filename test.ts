import { CryptoWebApiClient } from './dist/index.js';

async function getTransaction() {
  const client = new CryptoWebApiClient({
    apiKey: 'cc608a05-d748-4178-9b3c-e9f94375f806',
  });

  try {
    const data = await client.getTransaction({
      network: 'ethereum',
      transactionId: '0x2aac1b3dfe573591af8d3ba78f25ffc8280b061d26493d97a8ba9f4c2008a93f',
    });
    console.log('data :>> ', data);
  } catch (error) {
    console.error('Error fetching transaction details:', { error });
  }
}

getTransaction();

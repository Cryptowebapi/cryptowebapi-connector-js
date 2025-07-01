import { CryptoWebApiClient } from '../client';

// Mock the entire modules to avoid real API calls
jest.mock('../modules/build-transaction', () => ({
  buildTransaction: jest.fn()
}));

jest.mock('../modules/get-blockchain-meta', () => ({
  getBlockchainMeta: jest.fn()
}));

describe('CryptoWebApiClient - Transaction Builder (Simplified)', () => {
  let client: CryptoWebApiClient;
  let mockBuildTransaction: jest.Mock;
  let mockGetBlockchainMeta: jest.Mock;

  beforeEach(() => {
    client = new CryptoWebApiClient({
      apiKey: 'test-api-key',
    });

    // Get references to the mocked functions
    mockBuildTransaction = require('../modules/build-transaction').buildTransaction;
    mockGetBlockchainMeta = require('../modules/get-blockchain-meta').getBlockchainMeta;

    // Reset mocks
    mockBuildTransaction.mockReset();
    mockGetBlockchainMeta.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buildTransaction', () => {
    it('should delegate to buildTransaction module', async () => {
      const mockResponse = {
        success: true,
        message: 'Transaction built successfully',
        network: 'ethereum',
        data: {
          status: 'build' as const,
          type: 'native' as const,
          from: '0x1234567890123456789012345678901234567890',
          to: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
          value: '0.001',
          rawTx: '0xmockedrawTx',
          gasPrice: '20000000000',
          gasLimit: '21000',
          estimatedFeeEth: '0.00042',
          nonce: '42',
          chainId: '11155111',
        },
      };

      mockBuildTransaction.mockResolvedValue(mockResponse);

      const result = await client.buildTransaction({
        network: 'ethereum',
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
        value: '0.001',
        mode: 'testnet',
      });

      expect(mockBuildTransaction).toHaveBeenCalledWith(
        {
          network: 'ethereum',
          privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
          receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
          value: '0.001',
          mode: 'testnet',
        },
        expect.any(Object) // apiRequest object
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getBlockchainMeta', () => {
    it('should delegate to getBlockchainMeta module for fee data and account nonce', async () => {
      const mockResponse = {
        success: true,
        message: 'Blockchain metadata retrieved',
        network: 'ethereum',
        data: {
          feeData: {
            gasPrice: '20000000000',
            maxFeePerGas: '30000000000',
            maxPriorityFeePerGas: '2000000000',
          },
          gasLimit: '21000',
          chainId: '11155111',
          nonce: 42,
          balance: '1.5',
        },
      };

      mockGetBlockchainMeta.mockResolvedValue(mockResponse);

      const result = await client.getBlockchainMeta({
        network: 'ethereum',
        address: '0x1234567890123456789012345678901234567890',
        mode: 'mainnet',
      });

      expect(mockGetBlockchainMeta).toHaveBeenCalledWith(
        {
          network: 'ethereum',
          address: '0x1234567890123456789012345678901234567890',
          mode: 'mainnet',
        },
        expect.any(Object) // apiRequest object
      );
      expect(result).toEqual(mockResponse);
    });

    it('should delegate to getBlockchainMeta module for fee data only', async () => {
      const mockResponse = {
        success: true,
        message: 'Blockchain metadata retrieved',
        network: 'ethereum',
        data: {
          feeData: {
            gasPrice: '20000000000',
            maxFeePerGas: '30000000000',
            maxPriorityFeePerGas: '2000000000',
          },
          gasLimit: '21000',
          chainId: '11155111',
        },
      };

      mockGetBlockchainMeta.mockResolvedValue(mockResponse);

      const result = await client.getBlockchainMeta({
        network: 'ethereum',
        mode: 'mainnet',
      });

      expect(mockGetBlockchainMeta).toHaveBeenCalledWith(
        {
          network: 'ethereum',
          mode: 'mainnet',
        },
        expect.any(Object) // apiRequest object
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

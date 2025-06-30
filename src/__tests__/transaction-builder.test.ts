import { CryptoWebApiClient } from '../client';

// Mock the entire modules to avoid real API calls
jest.mock('../modules/build-transaction', () => ({
  buildTransaction: jest.fn()
}));

jest.mock('../modules/get-fee-data', () => ({
  getFeeData: jest.fn()
}));

jest.mock('../modules/get-account-nonce', () => ({
  getAccountNonce: jest.fn()
}));

describe('CryptoWebApiClient - Transaction Builder (Simplified)', () => {
  let client: CryptoWebApiClient;
  let mockBuildTransaction: jest.Mock;
  let mockGetFeeData: jest.Mock;
  let mockGetAccountNonce: jest.Mock;

  beforeEach(() => {
    client = new CryptoWebApiClient({
      apiKey: 'test-api-key',
    });

    // Get references to the mocked functions
    mockBuildTransaction = require('../modules/build-transaction').buildTransaction;
    mockGetFeeData = require('../modules/get-fee-data').getFeeData;
    mockGetAccountNonce = require('../modules/get-account-nonce').getAccountNonce;

    // Reset mocks
    mockBuildTransaction.mockReset();
    mockGetFeeData.mockReset();
    mockGetAccountNonce.mockReset();
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

  describe('getFeeData', () => {
    it('should delegate to getFeeData module', async () => {
      const mockResponse = {
        success: true,
        message: 'Fee data retrieved',
        network: 'ethereum',
        data: { gasPrice: '20000000000' },
      };

      mockGetFeeData.mockResolvedValue(mockResponse);

      const result = await client.getFeeData({
        network: 'ethereum',
        mode: 'mainnet',
      });

      expect(mockGetFeeData).toHaveBeenCalledWith(
        {
          network: 'ethereum',
          mode: 'mainnet',
        },
        expect.any(Object) // apiRequest object
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAccountNonce', () => {
    it('should delegate to getAccountNonce module', async () => {
      const mockResponse = {
        success: true,
        message: 'Nonce retrieved',
        network: 'ethereum',
        data: { nonce: 42 },
      };

      mockGetAccountNonce.mockResolvedValue(mockResponse);

      const result = await client.getAccountNonce({
        network: 'ethereum',
        address: '0x1234567890123456789012345678901234567890',
        mode: 'mainnet',
      });

      expect(mockGetAccountNonce).toHaveBeenCalledWith(
        {
          network: 'ethereum',
          address: '0x1234567890123456789012345678901234567890',
          mode: 'mainnet',
        },
        expect.any(Object) // apiRequest object
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

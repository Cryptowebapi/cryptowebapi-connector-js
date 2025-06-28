import { CryptoWebApiClient } from '../client';

// Create mock ethers module
const mockEthers = {
  Wallet: jest.fn().mockImplementation((privateKey) => ({
    address: '0x1234567890123456789012345678901234567890',
    signTransaction: jest.fn().mockResolvedValue('0xmockedrawTx'),
  })),
  Contract: jest.fn().mockImplementation(() => ({
    interface: {
      encodeFunctionData: jest.fn().mockReturnValue('0xmockeddata'),
    },
  })),
  parseUnits: jest.fn().mockReturnValue(BigInt('1000000000000000000')),
  parseEther: jest.fn().mockReturnValue(BigInt('1000000000000000000')),
  formatEther: jest.fn().mockReturnValue('0.001'),
};

describe('CryptoWebApiClient - Transaction Builder', () => {
  let client: CryptoWebApiClient;

  beforeEach(() => {
    client = new CryptoWebApiClient({
      apiKey: 'test-api-key',
    });

    // Mock the API request methods
    jest.spyOn(client as any, 'getAccountNonce').mockResolvedValue({
      success: true,
      message: 'Success',
      network: 'ethereum',
      data: { nonce: 42 },
    });

    jest.spyOn(client as any, 'getFeeData').mockResolvedValue({
      success: true,
      message: 'Success',
      network: 'ethereum',
      data: { gasPrice: '20000000000' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buildTransaction', () => {
    it('should build a native ETH transaction successfully', async () => {
      // Mock the dynamic import of ethers
      const originalFunction = global.Function;
      global.Function = jest.fn().mockReturnValue(() => Promise.resolve(mockEthers));

      const result = await client.buildTransaction({
        network: 'ethereum',
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
        value: '0.001',
        mode: 'testnet',
      });

      expect(result.success).toBe(true);
      expect(result.data.type).toBe('native');
      expect(result.data.rawTx).toBe('0xmockedrawTx');
      expect(result.data.from).toBe('0x1234567890123456789012345678901234567890');

      global.Function = originalFunction;
    });

    it('should build an ERC20 token transaction successfully', async () => {
      // Mock the dynamic import of ethers
      const originalFunction = global.Function;
      global.Function = jest.fn().mockReturnValue(() => Promise.resolve(mockEthers));

      const result = await client.buildTransaction({
        network: 'ethereum',
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
        value: '100',
        mode: 'testnet',
        contractAddress: '0xA0b86a33E6141d82e97fB65fA4D26a39f2F3e8F3',
        contractDecimal: 18,
      });

      expect(result.success).toBe(true);
      expect(result.data.type).toBe('erc20');
      expect(result.data.rawTx).toBe('0xmockedrawTx');

      global.Function = originalFunction;
    });

    it('should build a BEP20 token transaction for BNB network', async () => {
      // Mock the dynamic import of ethers
      const originalFunction = global.Function;
      global.Function = jest.fn().mockReturnValue(() => Promise.resolve(mockEthers));

      // Update the mock for BNB network
      jest.spyOn(client as any, 'getAccountNonce').mockResolvedValue({
        success: true,
        message: 'Success',
        network: 'bnb',
        data: { nonce: 42 },
      });

      jest.spyOn(client as any, 'getFeeData').mockResolvedValue({
        success: true,
        message: 'Success',
        network: 'bnb',
        data: { gasPrice: '5000000000' },
      });

      const result = await client.buildTransaction({
        network: 'bnb',
        privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
        receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
        value: '100',
        mode: 'mainnet',
        contractAddress: '0x55d398326f99059fF775485246999027B3197955', // USDT on BSC
        contractDecimal: 18,
      });

      expect(result.success).toBe(true);
      expect(result.data.type).toBe('bep20');
      expect(result.data.rawTx).toBe('0xmockedrawTx');

      global.Function = originalFunction;
    });

    it('should throw error for non-EVM networks', async () => {
      await expect(
        client.buildTransaction({
          network: 'bitcoin',
          privateKey: 'test-private-key',
          receiver: 'test-receiver',
          value: '0.001',
        })
      ).rejects.toThrow('Transaction building for bitcoin network is not yet implemented');
    });

    it('should throw error when ethers is not available', async () => {
      // Mock the dynamic import to fail
      const originalFunction = global.Function;
      global.Function = jest
        .fn()
        .mockReturnValue(() => Promise.reject(new Error('Module not found')));

      await expect(
        client.buildTransaction({
          network: 'ethereum',
          privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
          receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
          value: '0.001',
        })
      ).rejects.toThrow('ethers package is required for EVM transaction building');

      global.Function = originalFunction;
    });

    it('should throw error for missing required fields', async () => {
      await expect(
        client.buildTransaction({
          network: 'ethereum',
          privateKey: '',
          receiver: '0x742d35Cc6669C7532C39d3c7F2Ce8E12345AbCD1',
          value: '0.001',
        })
      ).rejects.toThrow('Missing required fields: privateKey, receiver, or value');
    });
  });

  describe('getFeeData', () => {
    it('should call the fee data endpoint correctly', async () => {
      // Remove the mock for this specific test and create a new one
      jest.restoreAllMocks();

      const mockMakeRequest = jest.spyOn(client['apiRequest'], 'makeRequest').mockResolvedValue({
        success: true,
        message: 'Success',
        network: 'ethereum',
        data: { gasPrice: '20000000000' },
      });

      const result = await client.getFeeData({
        network: 'ethereum',
        mode: 'mainnet',
      });

      expect(mockMakeRequest).toHaveBeenCalledWith('GET', '/api/blockchain/feeData', undefined, {
        params: { network: 'ethereum', mode: 'mainnet' },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('getAccountNonce', () => {
    it('should call the nonce endpoint correctly', async () => {
      // Remove the mock for this specific test and create a new one
      jest.restoreAllMocks();

      const mockMakeRequest = jest.spyOn(client['apiRequest'], 'makeRequest').mockResolvedValue({
        success: true,
        message: 'Success',
        network: 'ethereum',
        data: { nonce: 42 },
      });

      const result = await client.getAccountNonce({
        network: 'ethereum',
        address: '0x1234567890123456789012345678901234567890',
        mode: 'mainnet',
      });

      expect(mockMakeRequest).toHaveBeenCalledWith('GET', '/api/blockchain/nonce', undefined, {
        params: {
          network: 'ethereum',
          address: '0x1234567890123456789012345678901234567890',
          mode: 'mainnet',
        },
      });
      expect(result.success).toBe(true);
    });
  });
});

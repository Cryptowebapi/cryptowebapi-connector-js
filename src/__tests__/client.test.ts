import { CryptoWebApiClient } from '../client';
import { CryptoApiConfig } from '../types';
import { AxiosError, isAxiosError, getErrorMessage, getErrorStatus } from '../errors';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    defaults: {
      headers: {},
      baseURL: '',
      timeout: 10000,
    },
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    request: jest.fn(),
  })),
  isAxiosError: jest.fn(),
}));

describe('CryptoWebApiClient', () => {
  let client: CryptoWebApiClient;
  let config: CryptoApiConfig;

  beforeEach(() => {
    config = {
      apiKey: 'test-api-key',
      timeout: 5000,
    };
    client = new CryptoWebApiClient(config);
  });

  describe('constructor', () => {
    it('should create client with required apiKey', () => {
      const basicConfig: CryptoApiConfig = {
        apiKey: 'test-key',
      };
      const basicClient = new CryptoWebApiClient(basicConfig);

      expect(basicClient).toBeInstanceOf(CryptoWebApiClient);
    });

    it('should create client with custom config', () => {
      expect(client).toBeInstanceOf(CryptoWebApiClient);
      expect(client.getConfig()).toMatchObject(config);
    });
  });

  describe('configuration', () => {
    it('should update config', () => {
      const newConfig = { timeout: 15000 };
      client.updateConfig(newConfig);

      expect(client.getConfig().timeout).toBe(15000);
    });

    it('should get current config', () => {
      const currentConfig = client.getConfig();
      expect(currentConfig.apiKey).toBe(config.apiKey);
    });
  });

  describe('getTransaction endpoint', () => {
    it('should have getTransaction method', () => {
      expect(typeof client.getTransaction).toBe('function');
    });
  });

  describe('listTransactions endpoint', () => {
    it('should have listTransactions method', () => {
      expect(typeof client.listTransactions).toBe('function');
    });
  });

  describe('getSupportedCoins endpoint', () => {
    it('should have getSupportedCoins method', () => {
      expect(typeof client.getSupportedCoins).toBe('function');
    });
  });

  describe('validateWalletAddress endpoint', () => {
    it('should have validateWalletAddress method', () => {
      expect(typeof client.validateWalletAddress).toBe('function');
    });
  });

  describe('getWalletBalance endpoint', () => {
    it('should have getWalletBalance method', () => {
      expect(typeof client.getWalletBalance).toBe('function');
    });
  });

  describe('createWallet endpoint', () => {
    it('should have createWallet method', () => {
      expect(typeof client.createWallet).toBe('function');
    });
  });

  describe('sendTransaction endpoint', () => {
    it('should have sendTransaction method', () => {
      expect(typeof client.sendTransaction).toBe('function');
    });
  });
  describe('error handling', () => {
    it('should handle axios errors with helper functions', () => {
      // Create a mock axios error
      const mockAxiosError = {
        isAxiosError: true,
        message: 'Request failed',
        response: {
          status: 401,
          data: { message: 'Authentication failed' }
        }
      };

      expect(isAxiosError(mockAxiosError)).toBe(true);
      expect(getErrorMessage(mockAxiosError)).toBe('Authentication failed');
      expect(getErrorStatus(mockAxiosError)).toBe(401);
    });

    it('should handle non-axios errors', () => {
      const regularError = new Error('Regular error');
      
      expect(isAxiosError(regularError)).toBe(false);
      expect(getErrorMessage(regularError)).toBe('Regular error');
      expect(getErrorStatus(regularError)).toBeUndefined();
    });
  });
});

import { CryptoWebApiClient } from '../client';
import { CryptoApiConfig } from '../types';
import { AuthenticationError, NetworkError } from '../errors';

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

  describe('error handling', () => {
    it('should handle authentication errors', () => {
      const authError = new AuthenticationError();
      expect(authError).toBeInstanceOf(AuthenticationError);
      expect(authError.code).toBe('AUTH_ERROR');
      expect(authError.statusCode).toBe(401);
    });

    it('should handle network errors', () => {
      const networkError = new NetworkError('Connection failed');
      expect(networkError).toBeInstanceOf(NetworkError);
      expect(networkError.code).toBe('NETWORK_ERROR');
    });
  });
});

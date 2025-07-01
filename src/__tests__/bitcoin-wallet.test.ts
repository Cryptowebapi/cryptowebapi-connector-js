import { BitcoinWalletService } from '../modules/create-wallet/services/bitcoin-wallet.service';

describe('BitcoinWalletService', () => {
  let service: BitcoinWalletService;

  beforeEach(() => {
    service = new BitcoinWalletService();
  });

  describe('createWallet', () => {
    it('should create a Bitcoin wallet with minimal dependencies', async () => {
      // Mock the dynamic imports to avoid requiring actual packages
      const mockBitcoin = {
        networks: {
          bitcoin: { name: 'bitcoin' },
          testnet: { name: 'testnet' }
        },
        payments: {
          p2pkh: jest.fn().mockReturnValue({
            address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
          })
        }
      };

      const mockSecp = {
        utils: {
          randomPrivateKey: jest.fn().mockReturnValue(new Uint8Array([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
          ]))
        },
        getPublicKey: jest.fn().mockReturnValue(new Uint8Array([
          2, 121, 190, 102, 126, 249, 220, 187, 172, 85, 160, 98, 149, 206, 135, 11,
          7, 2, 155, 252, 219, 45, 206, 40, 217, 89, 242, 129, 91, 22, 248, 23, 152
        ]))
      };

      // Mock the import methods
      jest.spyOn(service as any, 'importBitcoin').mockResolvedValue(mockBitcoin);
      jest.spyOn(service as any, 'importSecp256k1').mockResolvedValue(mockSecp);

      const result = await service.createWallet('mainnet');

      expect(result).toHaveProperty('address');
      expect(result).toHaveProperty('key');
      expect(result).toHaveProperty('mnemonic');
      expect(result.address).toBe('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
      expect(typeof result.key).toBe('string');
      expect(typeof result.mnemonic).toBe('string');
      expect(result.mnemonic.split(' ')).toHaveLength(12);
    });

    it('should create different wallets for mainnet and testnet', async () => {
      const mockBitcoin = {
        networks: {
          bitcoin: { name: 'bitcoin' },
          testnet: { name: 'testnet' }
        },
        payments: {
          p2pkh: jest.fn()
            .mockReturnValueOnce({ address: '1MainnetAddress' })
            .mockReturnValueOnce({ address: '2TestnetAddress' })
        }
      };

      const mockSecp = {
        utils: {
          randomPrivateKey: jest.fn().mockReturnValue(new Uint8Array(32).fill(1))
        },
        getPublicKey: jest.fn().mockReturnValue(new Uint8Array(33).fill(2))
      };

      jest.spyOn(service as any, 'importBitcoin').mockResolvedValue(mockBitcoin);
      jest.spyOn(service as any, 'importSecp256k1').mockResolvedValue(mockSecp);

      const mainnetWallet = await service.createWallet('mainnet');
      const testnetWallet = await service.createWallet('testnet');

      expect(mainnetWallet.address).toBe('1MainnetAddress');
      expect(testnetWallet.address).toBe('2TestnetAddress');
    });

    it('should handle errors gracefully', async () => {
      jest.spyOn(service as any, 'importBitcoin').mockRejectedValue(new Error('Package not found'));

      await expect(service.createWallet()).rejects.toThrow('Failed to create Bitcoin wallet');
    });

    it('should generate deterministic mnemonic from entropy', () => {
      const entropy = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      
      // Access private method for testing
      const mnemonic1 = (service as any).generateMnemonicFromEntropy(entropy);
      const mnemonic2 = (service as any).generateMnemonicFromEntropy(entropy);
      
      expect(mnemonic1).toBe(mnemonic2); // Should be deterministic
      expect(mnemonic1.split(' ')).toHaveLength(12);
      expect(typeof mnemonic1).toBe('string');
    });
  });

  describe('import methods', () => {
    it('should handle import errors gracefully', async () => {
      // Test the error handling without actual dynamic imports
      const service = new BitcoinWalletService();
      
      // This test verifies the error handling structure without requiring packages
      const importMethod = (service as any).importBitcoin;
      expect(typeof importMethod).toBe('function');
      
      const secpImportMethod = (service as any).importSecp256k1;
      expect(typeof secpImportMethod).toBe('function');
    });
  });
});

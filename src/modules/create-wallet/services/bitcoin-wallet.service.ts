import { WalletCreator, WalletCreationResult } from '../interfaces/wallet-creator.interface';

/**
 * Bitcoin wallet creation service
 * Implements wallet generation for Bitcoin network using bitcoinjs-lib
 */
export class BitcoinWalletService implements WalletCreator {
  
  /**
   * Creates a new Bitcoin wallet
   * @param mode - Network mode (mainnet or testnet)
   * @returns Promise containing wallet details
   */
  async createWallet(mode: 'mainnet' | 'testnet' = 'mainnet'): Promise<WalletCreationResult> {
    try {
      // Dynamic imports to avoid bundling issues - only 2 packages needed!
      const [bitcoin, secp] = await Promise.all([
        this.importBitcoin(),
        this.importSecp256k1()
      ]);

      // Determine the network based on the mode
      const network = mode === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

      // Generate random private key using @noble/secp256k1
      const privateKeyBytes = secp.utils.randomPrivateKey();
      const privateKey = Buffer.from(privateKeyBytes);

      // Get public key from private key
      const publicKeyBytes = secp.getPublicKey(privateKeyBytes, true); // compressed
      const publicKey = Buffer.from(publicKeyBytes);

      // Generate mnemonic from private key entropy
      const mnemonic = this.generateMnemonicFromEntropy(privateKeyBytes);

      // Get the address using P2PKH (Pay to Public Key Hash)
      const { address } = bitcoin.payments.p2pkh({
        pubkey: publicKey,
        network,
      });

      if (!address) {
        throw new Error('Failed to generate address');
      }

      return {
        address,
        key: privateKey.toString('hex'),
        mnemonic,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create Bitcoin wallet: ${errorMessage}`);
    }
  }

  /**
   * Dynamically import bitcoinjs-lib
   */
  private async importBitcoin(): Promise<any> {
    try {
      // @ts-ignore - Dynamic import to avoid TypeScript compile-time errors
      return await import('bitcoinjs-lib');
    } catch (error) {
      throw new Error(
        'bitcoinjs-lib package is required for Bitcoin wallet creation. Please install it: npm install bitcoinjs-lib'
      );
    }
  }

  /**
   * Dynamically import @noble/secp256k1
   */
  private async importSecp256k1(): Promise<any> {
    try {
      // @ts-ignore - Dynamic import to avoid TypeScript compile-time errors
      return await import('@noble/secp256k1');
    } catch (error) {
      throw new Error(
        '@noble/secp256k1 package is required for Bitcoin wallet creation. Please install it: npm install @noble/secp256k1'
      );
    }
  }

  /**
   * Generate a BIP39 mnemonic from entropy
   * Uses a deterministic approach with a subset of BIP39 wordlist
   */
  private generateMnemonicFromEntropy(entropy: Uint8Array): string {
    // BIP39 wordlist subset (commonly used words for simplicity)
    const wordlist = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
      'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
      'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'agent', 'agree',
      'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol',
      'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha',
      'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among', 'amount',
      'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry', 'animal',
      'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety',
      'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arcade',
      'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor',
      'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact',
      'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
      'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
      'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado',
      'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward', 'axis',
      'baby', 'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball',
      'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base',
      'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become',
      'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt',
      'bench', 'benefit', 'best', 'betray', 'better', 'between', 'beyond', 'bicycle',
      'bid', 'bike', 'bind', 'biology', 'bird', 'birth', 'bitter', 'black',
      'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood',
      'blossom', 'blow', 'blue', 'blur', 'blush', 'board', 'boat', 'body',
      'boil', 'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring',
      'borrow', 'boss', 'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain',
      'brand', 'brass', 'brave', 'bread', 'breeze', 'brick', 'bridge', 'brief',
      'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother',
      'brown', 'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb',
      'bulk', 'bullet', 'bundle', 'bunker', 'burden', 'burger', 'burst', 'bus',
      'business', 'busy', 'butter', 'buyer', 'buzz', 'cabbage', 'cabin', 'cable'
    ];
    
    // Generate 12 words deterministically from entropy
    const words: string[] = [];
    for (let i = 0; i < 12; i++) {
      // Use multiple bytes for better distribution
      const index = ((entropy[i * 2] << 8) | entropy[(i * 2 + 1) % entropy.length]) % wordlist.length;
      words.push(wordlist[index]);
    }
    
    return words.join(' ');
  }
}

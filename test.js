

const { Block, Blockchain } = require("./blockchain");
const SHA256 = require("crypto-js/sha256");

describe('Blockchain', () => {

    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });


    test('should add new blocks correctly', () => {
        blockchain.addBlock(new Block(1, "09/03/2025", { amount: 10 }));
        blockchain.addBlock(new Block(2, "09/03/2025", { amount: 20 }));
        blockchain.addBlock(new Block(3, "09/03/2025", { amount: 30 }));

        expect(blockchain.chain.length).toBe(4);

        expect(blockchain.chain[1].previousHash).toBe(blockchain.chain[0].hash);
        expect(blockchain.chain[2].previousHash).toBe(blockchain.chain[1].hash);
        expect(blockchain.chain[3].previousHash).toBe(blockchain.chain[2].hash);
    });

    test('should validate blockchain integrity correctly', () => {
        blockchain.addBlock(new Block(1, "09/03/2025", { amount: 10 }));
        expect(blockchain.isChainValid()).toBe(true);

        blockchain.chain[1].data = { amount: 100 }; 

        expect(blockchain.isChainValid()).toBe(false);
    });

    test('should calculate hash correctly', () => {
        const block = new Block(1, "09/03/2025", { amount: 50 });
        const calculatedHash = block.calculateHash();
        expect(calculatedHash).toBe(SHA256(block.index + block.previousHash + block.timestamp + block.nonce + JSON.stringify(block.data)).toString());
    });

    test('should mine block correctly', () => {
        const block = new Block(1, "09/03/2025", { amount: 50 });
        block.mineBlock(blockchain.difficulty);
        
        expect(block.hash.substring(0, blockchain.difficulty)).toBe(Array(blockchain.difficulty + 1).join("0"));
    });

    test('should add a new block and validate chain correctly', () => {
        blockchain.addBlock(new Block(4, "09/03/2025", { amount: 40 }));
        expect(blockchain.isChainValid()).toBe(true);
    });

});


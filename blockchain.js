
const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = '') {

        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash();
        this.nonce = 0;

    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + this.nonce + JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }

}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, "09/03/2025", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

}

console.log("Hello, Blockchain!");
let myBlockchain = new Blockchain();

for (let i = 1; i <= 10; i++) {
    myBlockchain.addBlock(new Block(i, "09/03/2025", { amount: i * 10 }));
}

console.log(JSON.stringify(myBlockchain, null, 4));
console.log("Blockchain validity: ", myBlockchain.isChainValid());

console.log("\nChange a block under index 5: ");
myBlockchain.chain[4].data = { amount: 1000 };
myBlockchain.chain[4].hash = myBlockchain.chain[4].calculateHash();
console.log("Blockchain validity with recalculated hash: ", myBlockchain.isChainValid());

console.log("\nChange the last block: ");
myBlockchain.chain[10].data = { amount: 9999 };
console.log("Blockchain validity: ", myBlockchain.isChainValid());

console.log("\nAdding new block: ");
myBlockchain.addBlock(new Block(11, "09/03/2025", { amount: 111 }));
console.log("Blockchain validity: ", myBlockchain.isChainValid());

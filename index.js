import  {createHash} from 'crypto';

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.next = null;
    }

    calculateHash() {
        return createHash('sha256').update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).digest('hex');
    }
}

class Blockchain {
    constructor() {
        const genesisBlock = this.createGenesisBlock();
        this.head = genesisBlock;
        this.tail = genesisBlock;
    }

    // create the genesis block
    createGenesisBlock() {
        const genesisBlockData = {
            chainID: 0,
            transactions: [],
            consensus: 'PoW',
            difficulty: 0,
            nonce: 0
        };

        return new Block(0, new Date(), JSON.stringify(genesisBlockData), '0');
    }

    // add a new block to the blockchain
    addBlock(newBlock) {
        newBlock.previousHash = this.tail.hash;
        newBlock.hash = newBlock.calculateHash();
        this.tail.next = newBlock;
        this.tail = newBlock;
    }

    // checking integrity of the blockchain
    isChainValid() {
        let currentBlock = this.head;

        while (currentBlock != null && currentBlock.next != null) {
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.next.previousHash !== currentBlock.hash) {
                return false;
            }

            currentBlock = currentBlock.next;
        }

        return true;
    }

    // Print the entire blockchain
    printBlockchain() {
        let currentBlock = this.head;
        while (currentBlock != null) {
            console.log(`+-------------------------+`);
            console.log(`| Index: ${currentBlock.index}`);
            console.log(`| Timestamp: ${currentBlock.timestamp}`);
            console.log(`| Data: ${JSON.stringify(currentBlock.data)}`);
            console.log(`| Hash: ${currentBlock.hash}`);
            console.log(`| Previous Hash: ${currentBlock.previousHash}`);
            console.log(`+-------------------------+`);
            if (currentBlock.next != null) {
                console.log(`           ↓`);
            }
            currentBlock = currentBlock.next;
        }
    }
}


// Creating the blockchain
let blockchain = new Blockchain();

// Adding blocks to the blockchain
blockchain.addBlock(new Block(1, new Date(), { amount: 4 }));
blockchain.addBlock(new Block(2, new Date(), { amount: 10 }));

// Print the blockchain
blockchain.printBlockchain();
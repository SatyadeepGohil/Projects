class TrieNode {
    constructor() {
        this.children = Array(26).fill(null);
        this.end = false;
    }
}

class Trie {
    constructor() { this.root = new TrieNode(); }

    insert(key) {
        let curr = this.root;

        for (let c of key) {
            let index = c.charCodeAt(0) - 'a'.charCodeAt(0);

            if (curr.children[index] === null) {
                curr.children[index] = new TrieNode();
            }

            curr = curr.children[index];
        }
        curr.end = true;
    }

    search(key) {
        let curr = this.root;

        for (let c of key) {
            let index = c.charCodeAt(0) - 'a'.charCodeAt(0);

            if (curr.children[index] === null) return false;

            curr = curr.children[index];
        }

        return curr.end;
    }

    isPrefix(prefix) {
        let curr = this. root;

        for (let c of prefix) {
            let index = c.charCodeAt(0) - 'a'.charCodeAt(0);

            if (curr.children[index] === null) return false;

            curr = curr.children[index];
        }

        return true;
    }
}

const trie = new Trie();
const arr = ['and', 'ant', 'do', 'dad'];
for (let s of arr) {
    let insertedWords = trie.insert(s);
}

const searchKeys = ['do', 'ant', 'dad'];
console.log(searchKeys.map(s => trie.search(s) ? 'true' : 'false').join(" "));

/* const prefixKeys = ['ge', 'ba', 'do', 'de'];
console.log(prefixKeys.map(s => trie.isPrefix(s) ? 'true' : 'false').join(" ")); */
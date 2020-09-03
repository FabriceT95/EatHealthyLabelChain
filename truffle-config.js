const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
const path = require('path');

module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "5777", // Match any network id
      //     gasLimit : 7000000
    },
    /*development: {
      host: "localhost",
      port: 8545,
      network_id: "*",// Match any network id
    },*/
    test: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "5777", // Any network (default: none)
    },

    ropsten: {
      provider: () => {

        try {
          const fileContents = fs.readFileSync(path.join(__dirname, 'secret.json'), 'utf8');
          const data = JSON.parse(fileContents);

          const privateKey = data.mnemonic;
          const infuraProjectId = data.infuraProjectToken;
          const rpcUrl = `https://ropsten.infura.io/v3/${infuraProjectId}`;
          const ropstenAccountId = 0;

          return new HDWalletProvider(privateKey, rpcUrl, ropstenAccountId);

        } catch (err) {
          console.error(err)
        }
      },
      network_id: 3,  // Ropsten's id
      gas: 4700000,
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};

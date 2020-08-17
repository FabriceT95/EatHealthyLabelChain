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
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};

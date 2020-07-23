const dataTest = require('./build/contracts/DataTest.json');
const Web3 = require('web3');
const web3 = new Web3('ws://localhost:7545');
const Tx = require('ethereumjs-tx').Transaction;
const privateKey = Buffer.from('fef84965c51e2b7fa41be75f70b1d467ca72b898f808e4fb0e07d28be6f3c130', 'hex');

class Web3Worker {

  constructor(web3) {
    this.web3 = web3;
    this.GasPrice = 0;

  }

  async launcher() {
    let GasPrice = await web3.eth.getGasPrice();
    GasPrice = parseInt(GasPrice) + parseInt(web3.utils.toHex(web3.utils.toWei("0.1111", "gwei")));
    this.GasPrice = GasPrice.toFixed(0)

  }

  init() {
    const that = this;
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        that.getAccounts().then(function (result) {
          that.accounts = result;
          console.log('Mes comptes : ' + that.accounts);
        });
      }, 100);
      that.getNetworkId().then(function (result) {
        that.networkId = result;
        that.deployedNetwork = dataTest.networks[that.networkId];
        console.log(' Network ID : ' + that.networkId);
        console.log('Deployed Network : ' + that.deployedNetwork);
      });

      setTimeout(() => {
        that.getContract().then(function (result) {
          that.contract = result;
          console.log('Contract : ' + that.contract);
          resolve();
        });
      }, 1000);
    })

  }

  getTransactionCount() {
    const web3Provider = this.web3;
    const that = this;
    return new Promise(function (resolve, reject) {
      resolve(web3Provider.eth.getTransactionCount(that.accounts[7]));
    })
  }


  getAccounts() {
    const web3Provider = this.web3;
    return new Promise(function (resolve, reject) {
      resolve(web3Provider.eth.getAccounts());
    });
  }

  getNetworkId() {
    const web3Provider = this.web3;
    return new Promise(function (resolve, reject) {
      resolve(web3Provider.eth.net.getId());

    });

  }

  getContract() {
    const web3Provider = this.web3;
    const that = this;
    console.log('Datatest ABI in getContrat() : ' + dataTest.abi);
    console.log('DeployedNetwork address in getContrat() : ' + that.deployedNetwork);
    return new Promise(function (resolve, reject) {
      resolve(new web3Provider.eth.Contract(dataTest.abi, that.deployedNetwork.address));
    });
  }

  async sendTransaction(productVoteIsEnded) {
      await worker.getTransactionCount().then(async function (nonce) {
        worker.nonce = nonce.toString(16);
        const rawTX = {
          gasPrice: '0x1111',
          gasLimit: '0x6691B7',
          to: worker.deployedNetwork.address,
          data: worker.contract.methods.endVote(productVoteIsEnded.productCode, productVoteIsEnded.productProposerAddress).encodeABI(),
          from: worker.accounts[7],
          nonce: '0x' + worker.nonce
        };
        const tx = new Tx(rawTX);
        tx.sign(privateKey);
        return new Promise((resolve) => {
          resolve(tx.serialize())
        });
      }).then(async (serializedTx) => {
        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', (result) => {
          console.log(result);
        })
      });
  }

}

const worker = new Web3Worker(web3);
worker.launcher();
worker.init().then(() => {
  setInterval(async () => {
    console.log('--------------------- RECHERCHE DE PRODUIT EN FIN DE PERIODE DE VOTE ---------------------');
    await worker.contract.methods.getProductsVoting().call().then(async (result) => {
      let productVoteIsEndedArray = [];
      for (let i = 0; i < result[0].length; i++) {
        if (result[0][i].endDate * 1000 < Date.now() && result[0][i].endDate !== '0') {
          productVoteIsEndedArray.push(result[0][i]);
        }
      }
      if (productVoteIsEndedArray.length > 0) {
        for (let i = 0; i < productVoteIsEndedArray.length; i++) {
          console.log('Fin du vote du produit ' + productVoteIsEndedArray[i].productCode + ' en cours');
          await worker.sendTransaction(productVoteIsEndedArray[i]);
          console.log('Le vote du produit ' + productVoteIsEndedArray[i].productCode + ' a bien été cloturé');
        }
      } else{
        console.log('--------------------- AUCUN : PROCHAIN ESSAI DANS 5 SECONDES ---------------------');
      }

    });

  }, 5000);
});



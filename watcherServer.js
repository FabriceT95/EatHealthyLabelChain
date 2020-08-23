const dataTest = require('./build/contracts/EatHealthyChain.json');
const Web3 = require('web3');
const web3 = new Web3('ws://localhost:7545');
const Tx = require('ethereumjs-tx').Transaction;
const fetch = require('node-fetch');
const schedule = require('node-schedule');
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
        data: worker.contract.methods.endVote(productVoteIsEnded.product_code, productVoteIsEnded.address_proposer).encodeABI(),
        from: worker.accounts[7],
        nonce: '0x' + worker.nonce
      };
      const tx = new Tx(rawTX);
      tx.sign(privateKey);
      return new Promise((resolve) => {
        resolve(tx.serialize())
      });
    }).then(async (serializedTx) => {
      await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', async (result) => {
        if (productVoteIsEnded.status === 'IN_MODIFICATION' && productVoteIsEnded.for_votes >= productVoteIsEnded.against_votes) {
          await fetch('http://192.168.42.219:8090/accepted_to_modified/' + productVoteIsEnded.product_code, {method: 'PUT'}).then(() => {
            console.log("il s'agissait d'un produit déjà existant :  cet 'ancien' produit a été placé en status 'MODIFIED', il est remplacé par ce nouveau produit");
          });
        }
        setTimeout(async () => {
          await fetch('http://192.168.42.219:8090/end_vote/' + productVoteIsEnded.product_code + '/' + productVoteIsEnded.for_votes + '/' + productVoteIsEnded.against_votes + '/' +productVoteIsEnded.end_date_timestamp+ '', {method: 'PUT'}).then(() => {
            console.log('SUCCESS');
          });
        }, 1000);

      })
    });
  }


}

const worker = new Web3Worker(web3);
worker.launcher();
worker.init().then(() => {
  setInterval(() => {
    console.log('--------------------- RECHERCHE DE PRODUIT EN FIN DE PERIODE DE VOTE ---------------------');
    fetch('http://192.168.42.219:8090/votable_products/', {method: 'GET'})
      .then(res => res.json())
      .then(async json => {
        let productVoteIsEndedArray = [];
        for (const product of json) {
          if (Date.now() > product.end_date_timestamp * 1000) {
            await worker.contract.methods.getDates(product.product_code).call().then(async (dates) => {
              if (parseInt(dates[0]) === product.start_date_timestamp && parseInt(dates[1]) === product.end_date_timestamp) {
                productVoteIsEndedArray.push(product);
              }
            })
          }
        }
        if (productVoteIsEndedArray.length > 0) {
          console.log(productVoteIsEndedArray.length);
          for (let i = 0; i < productVoteIsEndedArray.length; i++) {
            console.log('Fin du vote du produit ' + productVoteIsEndedArray[i].product_code + ' en cours');
            await worker.sendTransaction(productVoteIsEndedArray[i]);
            console.log('Le vote du produit ' + productVoteIsEndedArray[i].product_code + ' a bien été cloturé');
          }
        } else {
          console.log('--------------------- AUCUN : PROCHAIN ESSAI DANS 5 SECONDES ---------------------');
        }

      });
  }, 5000);

  schedule.scheduleJob('0 0 * * *', () => {
    fetch('http://192.168.42.219:8090/get_voted_alternatives/', {method: 'GET'})
      .then(res => res.json())
      .then(async json => {
        await worker.contract.methods.manageAlternatives(json).send({from:worker.accounts[7]}).on('receipt', async () => {
          fetch('http://192.168.42.219:8090/new_day_alternative_votes/', {method: 'PUT'}).then(() => {
            console.log('SUCCESS : new_votes_today reset to false');
          });

        })
      })
  }); // run everyday at midnight
});



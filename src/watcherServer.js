const eatHealthyABI = require('../build/contracts/EatHealthyChain.json');
const fs = require('fs');
const path = require('path');
const fileContents = fs.readFileSync(path.join(__dirname + '/../', 'secret.json'), 'utf8');
const secretData = JSON.parse(fileContents);
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const fetch = require('node-fetch');
const schedule = require('node-schedule');
const {program} = require('commander');

program
  .option('-ip, --ip <ip>', 'ip address chosen')
  .option('-p, --port <port>', 'port chosen')
  .option('-m, --mode <mode>', 'mode chosen');

program.parse(process.argv);

// Private key to sign the transaction
const privateKey = Buffer.from(secretData.privateKey, 'hex');

class Web3Worker {

  constructor() {}

  async launcher() {
    let GasPrice = await web3.eth.getGasPrice();
    GasPrice = parseInt(GasPrice) + parseInt(web3.utils.toHex(web3.utils.toWei("0.1111", "gwei")));
    //   this.GasPrice = GasPrice.toFixed(0)

  }

  async init() {
    this.web3 = new Web3(`https://ropsten.infura.io/v3/${secretData.infuraProjectToken}`);
    this.networkId = await this.web3.eth.net.getId();
    this.deployedNetwork = eatHealthyABI.networks[this.networkId];
    this.contract = new this.web3.eth.Contract(eatHealthyABI.abi, this.deployedNetwork.address);
    /* const networkId = await web3.eth.net.getId();
     this.contract = new web3.eth.Contract(eatHealthyABI.abi, eatHealthyABI.networks[networkId].address)*/


    // return new Promise(function (resolve, reject) {
    /* setTimeout(() => {
       that.getAccounts().then(function (result) {
         that.accounts = result;
         console.log('Mes comptes : ' + that.accounts);
       });
     }, 100);*/
    /*  that.getNetworkId().then(function (result) {
        that.networkId = result;
        that.deployedNetwork = eatHealthyABI.networks[that.networkId];
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
    })*/

  }

  getTransactionCount() {
    return new Promise(function (resolve, reject) {
      resolve(worker.web3.eth.getTransactionCount(secretData.publicKey));
    })
  }


  /*  getAccounts() {
      const web3Provider = this.web3;
      return new Promise(function (resolve, reject) {
        resolve(web3Provider.eth.getAccounts());
      });
    }*/

  /*getNetworkId() {
    const web3Provider = this.web3;
    return new Promise(function (resolve, reject) {
      resolve(web3Provider.eth.net.getId());

    });

  }*/

  /*getContract() {
    const web3Provider = this.web3;
    const that = this;
    console.log('Datatest ABI in getContrat() : ' + eatHealthyABI.abi);
    console.log('DeployedNetwork address in getContrat() : ' + that.deployedNetwork);
    return new Promise(function (resolve, reject) {
      resolve(new web3Provider.eth.Contract(eatHealthyABI.abi, that.deployedNetwork.address));
    });
  }*/

  async signTransaction(rawTX) {
    return await worker.getTransactionCount().then(async function (nonce) {
      return new Promise(function (resolve, reject) {
        resolve(nonce)
      });
    }).then(async nonce => {
      rawTX.nonce = '0x' + nonce.toString(16);
      const tx = new Tx(rawTX, {'chain': 'ropsten'});
      tx.sign(privateKey);
      return tx.serialize().toString('hex');
    })

  }


}

const worker = new Web3Worker();
worker.init().then(() => {
  if (program.mode.toLowerCase() === 'bc') {
    setInterval(async () => {
      console.log('--------------------- RECHERCHE DE PRODUIT EN FIN DE PERIODE DE VOTE ---------------------');
      fetch('http://' + program.ip + ':' + program.port + '/votable_products/', {method: 'GET'})
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
            for (let i = 0; i < productVoteIsEndedArray.length; i++) {
              console.log('Fin du vote du produit ' + productVoteIsEndedArray[i].product_code + ' en cours');
              const rawTX = {
                gasPrice: '0x1111',
                gasLimit: '0x6691B7',
                to: worker.deployedNetwork.address,
                data: worker.contract.methods.endVote(productVoteIsEndedArray[i].product_code).encodeABI(),
                from: secretData.publicKey,
                nonce: '',
              };

              await worker.signTransaction(rawTX).then(async (serializedTx) => {
                await worker.web3.eth.sendSignedTransaction('0x' + serializedTx).on('receipt', async () => {
                  if (productVoteIsEndedArray[i].status === 'IN_MODIFICATION' && productVoteIsEndedArray[i].for_votes >= productVoteIsEndedArray[i].against_votes) {
                    await fetch('http://' + program.ip + ':' + program.port + '/accepted_to_modified/' + productVoteIsEndedArray[i].product_code, {method: 'PUT'}).then(() => {
                      console.log("il s'agissait d'un produit déjà existant :  cet 'ancien' produit a été placé en status 'MODIFIED', il est remplacé par ce nouveau produit");
                    });
                  }
                  setTimeout(async () => {
                    await fetch('http://' + program.ip + ':' + program.port + '/end_vote/' + productVoteIsEndedArray[i].product_code + '/' + productVoteIsEndedArray[i].for_votes + '/' + productVoteIsEndedArray[i].against_votes + '/' + productVoteIsEndedArray[i].end_date_timestamp + '', {method: 'PUT'}).then(() => {
                      console.log('SUCCESS');
                    });
                  }, 1000);

                })
              });
              console.log('Le vote du produit ' + productVoteIsEndedArray[i].product_code + ' a bien été cloturé');
            }
          } else {
            console.log('--------------------- AUCUN : PROCHAIN ESSAI DANS 5 SECONDES ---------------------');
          }

        });
    }, 900000);

    // run everyday at midnight : Alternatives which was voted the day, we will be updated into the contract,
    // it allows the user to don't have to pay fees but contrat owner will do once a day
    schedule.scheduleJob('0 0 * * *', () => {
      fetch('http://' + program.ip + ':' + program.port + '/get_voted_alternatives/', {method: 'GET'})
        .then(res => res.json())
        .then(async json => {
          const rawTX = {
            gasPrice: '0x1111',
            gasLimit: '0x6691B7',
            to: worker.deployedNetwork.address,
            data: worker.contract.methods.manageAlternatives(json).encodeABI(),
            from: secretData.publicKey,
            nonce: ''
          };

          await worker.signTransaction(rawTX).then(async (serializedTx) => {
            await this.web3.eth.sendSignedTransaction('0x' + serializedTx).on('receipt', async () => {
              fetch('http://' + program.ip + ':' + program.port + '/new_day_alternative_votes/', {method: 'PUT'}).then(() => {
                console.log('SUCCESS : new_votes_today reset to false');
              });
            });
          });
        });
    });
  } else if (program.mode.toLowerCase() === 'mysql') {
    setInterval(async () => {
      console.log('--------------------- RECHERCHE DE PRODUIT EN FIN DE PERIODE DE VOTE ---------------------');
      fetch('http://' + program.ip + ':' + program.port + '/votable_products/', {method: 'GET'})
        .then(res => res.json())
        .then(async json => {
          let productVoteIsEndedArray = [];
          for (const product of json) {
            if (Date.now() > product.end_date_timestamp * 1000) {
              productVoteIsEndedArray.push(product);
            }
          }


          if (productVoteIsEndedArray.length > 0) {
            console.log(productVoteIsEndedArray.length);
            for (let i = 0; i < productVoteIsEndedArray.length; i++) {
              console.log('Fin du vote du produit ' + productVoteIsEndedArray[i].product_code + ' en cours');
              if (productVoteIsEndedArray[i].status === 'IN_MODIFICATION' && productVoteIsEndedArray[i].for_votes >= productVoteIsEndedArray[i].against_votes) {
                await fetch('http://' + program.ip + ':' + program.port + '/accepted_to_modified/' + productVoteIsEndedArray[i].product_code, {method: 'PUT'}).then(() => {
                  console.log("il s'agissait d'un produit déjà existant :  cet 'ancien' produit a été placé en status 'MODIFIED', il est remplacé par ce nouveau produit");
                });
              }
              setTimeout(async () => {
                await fetch('http://' + program.ip + ':' + program.port + '/end_vote/' + productVoteIsEndedArray[i].product_code + '/' + productVoteIsEndedArray[i].for_votes + '/' + productVoteIsEndedArray[i].against_votes + '/' + productVoteIsEndedArray[i].end_date_timestamp + '', {method: 'PUT'}).then(() => {
                  console.log('SUCCESS');
                });
              }, 1000);
              console.log('Le vote du produit ' + productVoteIsEndedArray[i].product_code + ' a bien été cloturé');
            }
          } else {
            console.log('--------------------- AUCUN : PROCHAIN ESSAI DANS 5 SECONDES ---------------------');
          }
        });
    }, 5000);
  }
});

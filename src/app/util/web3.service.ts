import {EventEmitter, Inject, InjectionToken, OnInit} from '@angular/core';
import Web3 from 'web3';
import dataTest from './../../../build/contracts/DataTest.json';

export const WEB3 = new InjectionToken<Web3>('web3', {
  providedIn: 'root',
  factory: () => {
      try {
        const provider = ('ethereum' in window) ? window['ethereum'] : Web3.givenProvider;
        return new Web3(provider);
      } catch (err) {
        throw new Error('Non-Ethereum browser detected. You should consider trying Mist or MetaMask!');
      }
  }
});

export class Web3Service {
  accountChanged = new EventEmitter<any>();
  newVote = new EventEmitter<any>();
  isChecked = true;
  that: any;
  accounts: any;
  networkId: any;
  deployedNetwork: any;
  contract: any;
  role: any;
  isBeingModified = false;
  constructor(@Inject(WEB3) public web3: Web3) {
    const that = this;
    this.getWeb3Provider();
    setInterval(() => {
      that.getAccount().then(function(result) {
        if (that.accounts !== result && !that.isBeingModified) {
          that.accountChanged.emit(that.accounts);
        }
        that.accounts = result;
        console.log('GetAccount in Web3Service : ' + that.accounts);
      });
    }, 100);
  /*  this.getAccount().then(function(result) {
      that.accounts = result;
      console.log('GetAccount in Web3Service : ' + that.accounts);
    });*/
    this.getNetworkId().then(function(result) {
      that.networkId = result;
      that.deployedNetwork = dataTest.networks[that.networkId];
      console.log('GetNetworkId in Web3Service : ' + that.networkId);
      console.log('DeployedNetwork ABI : ' +  that.deployedNetwork.address);
    });
    setTimeout(() => {
      this.getContract().then(function (result) {
        that.contract = result;
        // Define functions which are needed to be launched on load just after getContract is setup
        that.getMyRole();
        console.log('GetContract in Web3Service : ' + that.contract);
      });
    }, 500);
  }

  async getWeb3Provider() {
    if ('enable' in this.web3.currentProvider) {
      await this.web3.currentProvider.enable();
    }
  }

  public getAccount() {
    const web3Provider = this.web3;
    return new Promise(function(resolve, reject) {
      resolve(web3Provider.eth.getAccounts());
      // console.log('bimbam : ' + that.accounts);
    });
  }
  public getNetworkId() {
    const web3Provider = this.web3;
    return new Promise(function(resolve, reject) {
      resolve(web3Provider.eth.net.getId());

    });
  }

 public getContract() {
    const web3Provider = this.web3;
    const that = this;
    console.log('Datatest ABI in getContrat() : ' + dataTest.abi);
    console.log('DeployedNetwork address in getContrat() : ' + that.deployedNetwork);
    return new Promise(function (resolve, reject) {
       resolve(new web3Provider.eth.Contract(dataTest.abi, that.deployedNetwork.address));
     });
  }

  async getMyRole() {
    this.role = await this.contract.methods.getRole().call({from: this.accounts[0]});
    console.log('Mon rôle : ' + this.role);
  }

}



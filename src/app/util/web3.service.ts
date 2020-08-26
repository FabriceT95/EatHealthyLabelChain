import {EventEmitter, Inject, InjectionToken, OnInit} from '@angular/core';
import Web3 from 'web3';
import EatHealthyChain from './../../../build/contracts/EatHealthyChain.json';

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
  endVote = new EventEmitter<any>();
  realLabelizedProductArray: { [productCode: number]: any[] } = {};
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
      that.getAccount().then(function (result) {
        if (that.accounts !== result && !that.isBeingModified) {
          that.accountChanged.emit(that.accounts);
        }
        that.accounts = result;
        console.log('GetAccount in Web3Service : ' + that.accounts[0]);
      });
    }, 100);
    this.getNetworkId().then(function (result) {
      that.networkId = result;
      that.deployedNetwork = EatHealthyChain.networks[that.networkId];
      console.log('GetNetworkId in Web3Service : ' + that.networkId);
      console.log('DeployedNetwork ABI : ' + that.deployedNetwork.address);
    });
    setTimeout(() => {
      that.getContract().then(async function (result) {
        that.contract = result;
        // Define functions which are needed to be launched on load just after getContract is setup
        // that.getMyRole();
        console.log('GetContract in Web3Service : ' + that.contract);
        const labelizedProductCode = [1234567891234, 5555555555555];
        const lengthEachProductLabels = 2;
        for (const element of labelizedProductCode) {
          const arrayOneProductLabels = [];
          let iterationOverProductLabels = 0;
          const LabelObject = {
            uniqueRealLabelId: 0 ,
            label_name: '',
            expiration_date : 0
          };
          while (true) {
            try {
              const realLabelizedProduct = await that.contract.methods.productCodeToRealLabels(element, iterationOverProductLabels).call();
              LabelObject.uniqueRealLabelId = realLabelizedProduct.uniqueRealLabelId;
              LabelObject.label_name = realLabelizedProduct.label_name;
              LabelObject.expiration_date = realLabelizedProduct.expiration_date;
              arrayOneProductLabels.push(LabelObject);
              iterationOverProductLabels++;
            } catch (e) {
                break;
              }
          }
          that.realLabelizedProductArray[element] = arrayOneProductLabels;
          console.log('aiee : ' + JSON.stringify(that.realLabelizedProductArray));
       }
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
    return new Promise(function (resolve, reject) {
      resolve(web3Provider.eth.getAccounts());
    });
  }

  public getNetworkId() {
    const web3Provider = this.web3;
    return new Promise(function (resolve, reject) {
      resolve(web3Provider.eth.net.getId());
    });
  }

  public getContract() {
    const web3Provider = this.web3;
    const that = this;
    console.log('Datatest ABI in getContrat() : ' + EatHealthyChain.abi);
    console.log('DeployedNetwork address in getContrat() : ' + that.deployedNetwork);
    return new Promise(function (resolve, reject) {
      resolve(new web3Provider.eth.Contract(EatHealthyChain.abi, that.deployedNetwork.address));
    });
  }
}



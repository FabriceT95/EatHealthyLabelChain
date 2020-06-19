import {Component, Inject, OnInit} from '@angular/core';
import {WEB3} from './util/web3.service';
import Web3 from 'web3';
import dataTest from './../../build/contracts/dataTest.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  accounts: any;
  networkId: any;
  deployedNetwork: any;
  contract: any;
  role: any;

  constructor(@Inject(WEB3) public web3: Web3) {}

  async ngOnInit() {
    if ('enable' in this.web3.currentProvider) {
      await this.web3.currentProvider.enable();
    }
    this.accounts = await this.web3.eth.getAccounts();
    this.networkId = await this.web3.eth.net.getId();
    this.deployedNetwork = dataTest.networks[this.networkId];
    this.contract = new this.web3.eth.Contract(
      dataTest.abi,
      this.deployedNetwork.address
    );
    // this.role = await this.contract.methods.getRole().call({from: this.accounts[0]});

  }




}

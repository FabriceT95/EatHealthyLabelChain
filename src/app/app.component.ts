import {Component, Inject, OnInit} from '@angular/core';
import {Web3Service} from './util/web3.service';
import dataTest from './../../build/contracts/DataTest.json';
import {ServerService} from './server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {
  title = 'app works!';
  role: any;
  isChecked: boolean;
  loadedPage = 'accueil';

 /*constructor(public web3: WEB3) {
  }*/
  /*constructor(public web3: Web3Service) {
  }*/



async ngOnInit() {
  setTimeout(() => {
  /*  console.log('Mes comptes' + this.web3.accounts);
    console.log('Network Id : ' + this.web3.networkId);
    console.log('Deployed network : ' + this.web3.deployedNetwork);
    console.log('DeployedNetwork Address : ' +  this.web3.deployedNetwork.address);
    console.log('Get Contract : ' + this.web3.contract.methods.getRole());*/
   // this.getMyRole();
    }, 500);
}
 /*   if ('enable' in this.web3.currentProvider) {
      await this.web3.currentProvider.enable();
    }
     this.accounts = await this.web3.eth.getAccounts();
    this.networkId = await this.web3.eth.net.getId();
    this.deployedNetwork = dataTest.networks[this.networkId];
    this.contract = new this.web3.eth.Contract(
      dataTest.abi,
      this.deployedNetwork.address
    );

     console.log(this.web3);
   this.role = await this.contract.methods.getRole().call({from: this.accounts[0]});
    console.log(this.role);*/



  onNavigate(page: string) {
    this.loadedPage = page;
  }

  onDataSourceChanged(boolSourceData) {
    this.isChecked = boolSourceData;
    console.log('isChecked from app.component.ts : ', this.isChecked);
  }

}

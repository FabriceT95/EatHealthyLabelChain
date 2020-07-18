import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  walletAddress: any;
  reputationPoints: number;
  remainingVotes: number;
  singleRequest = false;

  constructor(public web3: Web3Service) {
  }

  setUser(address) {
    this.web3.contract.methods.addressToUser(address).call().then((result) => {
      if (result.isExist === false && !this.singleRequest && !this.web3.isBeingModified) {
        this.singleRequest = true;
        this.web3.isBeingModified = true;
        this.web3.contract.methods.subscribeUser().send({from: address}).then(() => {
          alert('VOUS ETES INSCRIT YOLO');
          this.web3.contract.methods.addressToUser(address).call().then((userDatas) => {
            this.reputationPoints = userDatas.reputation;
            this.remainingVotes = userDatas.tokenNumber;
            this.singleRequest = false;
            this.web3.isBeingModified = false;
          });
        });
      } else {
        this.web3.contract.methods.addressToUser(address).call().then((userDatas) => {
          this.reputationPoints = userDatas.reputation;
          this.remainingVotes = userDatas.tokenNumber;
        });
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.walletAddress = this.web3.accounts[0];
      this.setUser(this.walletAddress);
    }, 500);
    setTimeout(() => {

      this.web3.accountChanged.subscribe(
        (account: any) => {
          this.walletAddress = account[0];
          this.setUser(this.walletAddress);
        });
    }, 500);
  }

}

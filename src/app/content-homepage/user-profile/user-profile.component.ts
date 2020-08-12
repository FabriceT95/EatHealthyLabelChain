import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import {ServerSCService} from '../../server-sc.service';

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

  constructor(public web3: Web3Service, private server_sc: ServerSCService) {
  }


  async subscribeUser(user_description) {
    const that = this;
    this.web3.contract.methods.subscribeUser().send({from: user_description.user_address}).then(() => {
      that.server_sc.addUser(user_description).then(() => {
        alert('Vous êtes bien inscrit à la plateforme ! ');
        that.setUser(user_description.user_address);
      });
    });
  }

  setUser(address) {
    const user_description = {user_address: address};
    this.web3.contract.methods.addressToUser(address).call().then(async (existing) => {
      if (existing.isExist === false && !this.singleRequest && !this.web3.isBeingModified) {
        this.singleRequest = true;
        this.web3.isBeingModified = true;
        await this.subscribeUser(user_description);
      } else {
        this.server_sc.getUser(user_description).then(async (result: []) => {
          const uniqueSqlResult = result as any;
          if (uniqueSqlResult.length === 1) {
            this.reputationPoints = uniqueSqlResult[0].reputation;
            this.remainingVotes = uniqueSqlResult[0].token_number;
            this.singleRequest = false;
            this.web3.isBeingModified = false;
          } else {
            console.log('ERROR');
          }
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

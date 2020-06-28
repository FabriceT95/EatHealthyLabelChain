import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  walletAddress: any;
  constructor(public web3: Web3Service) {
  }

  ngOnInit() {
    setTimeout(() => {
      console.log('User profile address : ' + this.walletAddress);
      this.walletAddress = this.web3.accounts[0];
      this.web3.accountChanged.subscribe(
        (account: any) => {
          this.walletAddress = account;
        }
      );
    }, 300);
  }

}

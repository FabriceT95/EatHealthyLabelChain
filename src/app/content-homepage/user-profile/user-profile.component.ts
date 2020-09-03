import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import {ServerSCService} from '../../server-sc.service';
import keccak from 'keccak';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
// Component used in Homepage for displaying user profile elements
export class UserProfileComponent implements OnInit {
  walletAddress: any;
  reputationPoints: number = null;
  remainingVotes: number = null;
 // singleRequest = false;
  errorUserProfile = '';

  //  Web3Service for accessing the contract, ServerSCService to get database access
  constructor(public web3: Web3Service, private server_sc: ServerSCService) {
  }

  // subscribes user into the contract then into the DB
  async subscribeUser(user_description, param) {
    const that = this;
    console.log('heyahahahah : ' + this.server_sc.isChecked);
    if (!this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port_SC)) {
      this.web3.contract.methods.subscribeUser().send({from: user_description.user_address})
        .then(() => {
          that.server_sc.addUser(user_description).then(() => {
            alert('Vous êtes bien inscrit à la plateforme ! ');
            that.setUser(user_description.user_address, param);
          });
        });
     /*   .on('error', function (error, receipt) {
          alert('Erreur de la plateforme : ' + error.message);
        });*/
    } else if (this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port)) {
      that.server_sc.addUser(user_description).then(() => {
        alert('Vous êtes bien inscrit à la plateforme ! ');
        that.setUser(user_description.user_address, param);
      }).catch(() => alert('Erreur lors de l\'inscription !'));
    }
  }

  // display user datas if he is already subscribed, otherwise it subscribes him
  async setUser(address, param) {
    const user_description = {user_address: address};
    if (!this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port_SC) && param === 'sc') {
      try {
        this.web3.contract.methods.addressToUser(address).call().then(async (existing) => {
          if (existing.isExist === false && !this.web3.isBeingModified) {
           // this.singleRequest = true;
            this.web3.isBeingModified = true;
            await this.subscribeUser(user_description, 'sc');
          } else {
           // this.singleRequest = true;
            this.web3.isBeingModified = true;
            this.server_sc.getUser(user_description).then(async (result: []) => {
              const uniqueSqlResult = result as any;
              if (uniqueSqlResult.length === 1) {
                this.reputationPoints = uniqueSqlResult[0].reputation;
                this.remainingVotes = uniqueSqlResult[0].token_number;
            //    this.singleRequest = true;
                this.web3.isBeingModified = true;
              } else {
                this.errorUserProfile = 'Vous n\'êtes pas inscrit(e) !';
            //    this.singleRequest = false;
                this.web3.isBeingModified = false;
              }
            });
          }
        });
      } catch (Error) {
        this.errorUserProfile = 'Erreur de la plateforme, ré-essayez ulterieurement ';
      }
    } else if (this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port) && param === 'db') {
    //  this.singleRequest = true;
      this.web3.isBeingModified = true;
        this.server_sc.getUser(user_description).then(async (result: []) => {
          const uniqueSqlResult = result as any;
          console.log(uniqueSqlResult);
          if (uniqueSqlResult.length === 1) {
            this.reputationPoints = uniqueSqlResult[0].reputation;
            this.remainingVotes = uniqueSqlResult[0].token_number;
         //   this.singleRequest = false;
            this.web3.isBeingModified = false;
          } else {
            this.subscribeUser(user_description, param);
            // this.errorUserProfile = 'Vous n\'êtes pas inscrit(e) !';
         //   this.singleRequest = true;
            this.web3.isBeingModified = true;
          }
        });
  //    }
    }
  }

  // Leaving some time to the web service to be setup then set the user datas
  ngOnInit() {
    setTimeout(() => {
      this.walletAddress = this.web3.accounts[0];
      console.log('LE CONTRACT  : ' + JSON.stringify(this.web3.contract.methods));
      this.setUser(this.walletAddress, 'sc');
    }, 500);
    setTimeout(() => {
      this.web3.accountChanged.subscribe(
         (account: any) => {
          try {
            this.walletAddress = account[0];
            this.setUser(this.walletAddress, 'sc');
          } catch (Error) {
            alert('Refresh la page');
          }
        });
      this.server_sc.changeDataSource.subscribe(
         () => {
          try {
            this.setUser(this.walletAddress, 'db');
          } catch (Error) {
            alert('Refresh la page');
          }
        });
    }, 500);
  }
}

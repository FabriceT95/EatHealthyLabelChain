import {Component, EventEmitter, Inject, OnInit, Optional} from '@angular/core';
import {Web3Service} from '../../../util/web3.service';
import {ServerService} from '../../../server.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../../shared/product.model';
import {ServerSCService} from '../../../server-sc.service';

@Component({
  selector: 'app-user-form-vote',
  templateUrl: './user-form-vote.component.html',
  styleUrls: ['./user-form-vote.component.css']
})
export class UserFormVoteComponent implements OnInit {
  public checked = false;
  public productVote: Product;
  public isProductProposer: boolean;
  public alreadyVoted: boolean;
  public isDateVotable: boolean;
  private voter: any;

  constructor(private web3: Web3Service,
              private server: ServerService,
              private server_sc: ServerSCService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<UserFormVoteComponent>) {
    this.productVote = data.productvote;
  }

  ngOnInit() {
    this.voter = this.web3.accounts[0];
    this.server_sc.changeDataSource.subscribe(() => {
     if (this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port)) {
       const getVoterForProduct_object = {
         user_address: this.web3.accounts[0],
         productCode : this.productVote.code
       };
       this.server_sc.get_voter_for_product(getVoterForProduct_object).then((result_1: any) => {
         this.alreadyVoted = result_1.length === 1;
         if (this.alreadyVoted === false) {
           this.server_sc.get_product_proposer_new_modify(getVoterForProduct_object).then((result_2: any) => {
             this.isProductProposer = result_2.length === 1;
             if (this.isProductProposer) {
               const uniqueSqlResult_2 = result_2[0] as any;
               this.isDateVotable = uniqueSqlResult_2.end_date > Date.now() / 1000;
             } else {
               this.server_sc.get_dates_new_modify(getVoterForProduct_object).then((result_3: any) => {
                 const uniqueSqlResult_3 = result_3[0] as any;
                 this.isDateVotable = uniqueSqlResult_3.end_date > Date.now() / 1000;
               });
             }
           });
         }
       });

      } else if (!this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port_SC)) {
       this.web3.contract.methods.isAlreadyVotedByCurrentUser(this.productVote.code).call({from: this.web3.accounts[0]})
         .then((result) => {
           this.alreadyVoted = result;
           if (this.alreadyVoted === false) {
             this.web3.contract.methods.isProductProposer(this.productVote.code).call({from: this.web3.accounts[0]})
               .then((result_) => {
                 this.isProductProposer = result_;
               });
           }
         });
       this.web3.contract.methods.getDates(this.productVote.code).call()
         .then((dates) => {
           this.isDateVotable = dates[1] > dates[0];
         });
     }
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  voting(opinion) {
    const that = this;
    console.log('Mon vote : ' + opinion);
    console.log('Le produit pour lequel je vote : ' + this.productVote.code);
    if (this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port)) {
      that.web3.newVote.emit();
      that.addVote(opinion);
    } else if (!this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port_SC)) {
      this.web3.contract.methods.vote(opinion, this.productVote.code).send({from: this.web3.accounts[0]})
        .on('receipt', (receipt) => {
          that.web3.newVote.emit();
          that.addVote(opinion);
          if (opinion === true) {
            this.productVote.forVotes++;
          } else {
            this.productVote.againstVotes++;
          }
          // this.productVote.totalVotes++;
          alert('Votre vote a bien été pris en compte ! Merci, bisous distancés !');
          that.onNoClick();
        })
        .on('error', (error, receipt) => {
          console.log('Erreur : ' + error[0]);
        });
    }
  }

  addVote(opinion) {
    const newVote = {
      all_hash: this.productVote.all_hash,
      productCode: this.productVote.code,
      user_address: this.voter,
      opinion: opinion
    };
    this.server_sc.addVote(newVote).then(() => {
      console.log('Votre vote a bien été pris en compte');
    });
    // Ajouter le vote à la table "productInfos_SC"
    this.server_sc.UpdateVote(newVote).then(() => {
      console.log('Votre vote a bien été pris en compte');
    });
  }
}

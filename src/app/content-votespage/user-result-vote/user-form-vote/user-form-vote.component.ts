import {Component, EventEmitter, Inject, OnInit, Optional} from '@angular/core';
import {Web3Service} from '../../../util/web3.service';
import {ServerService} from '../../../server.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../../shared/product.model';

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

  constructor(private web3: Web3Service,
              private server: ServerService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<UserFormVoteComponent>) {
    this.productVote = data.productvote;
  }

  ngOnInit() {
    this.web3.contract.methods.isAlreadyVotedByCurrentUser(this.productVote.code).call({from: this.web3.accounts[0]})
      .then((result) => {
        this.alreadyVoted = result;
        if (this.alreadyVoted === false) {
          this.web3.contract.methods.isProposer(this.productVote.code).call({from: this.web3.accounts[0]})
            .then((result_) => {
              this.isProductProposer = result_;
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
    this.web3.contract.methods.vote(opinion, this.productVote.code).send({from: this.web3.accounts[0]})
      .on('receipt', (receipt) => {
        that.web3.newVote.emit();
        if (opinion === true) {
          this.productVote.forVotes++;
        } else {
          this.productVote.againstVotes++;
        }
        this.productVote.totalVotes++;
        alert('Votre vote a bien été pris en compte ! Merci, bisous distancés !');

      })
      .on('error', (error, receipt) => {
        console.log('Erreur : ' + error[0]);
      });
  }
}

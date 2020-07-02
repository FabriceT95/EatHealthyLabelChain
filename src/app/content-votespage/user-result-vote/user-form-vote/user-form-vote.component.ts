import {Component, Inject, OnInit, Optional} from '@angular/core';
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
  public productVote: Product;
  constructor(    private web3: Web3Service,
                  private server: ServerService,
                  @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
                  public dialogRef: MatDialogRef<UserFormVoteComponent>) {
    this.productVote = data.productvote;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

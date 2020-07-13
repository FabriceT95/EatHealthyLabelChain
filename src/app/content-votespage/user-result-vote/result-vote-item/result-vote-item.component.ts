import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../../shared/product.model';
import {MatDialog} from '@angular/material/dialog';
import {UserFormVoteComponent} from '../user-form-vote/user-form-vote.component';
import {Web3Service} from '../../../util/web3.service';

@Component({
  selector: 'app-result-vote-item',
  templateUrl: './result-vote-item.component.html',
  styleUrls: ['./result-vote-item.component.css']
})
export class ResultVoteItemComponent implements OnInit {
  @Input() productvote: Product;
  constructor(public dialog: MatDialog, private web3: Web3Service) { }

  ngOnInit() {
    console.log(this.productvote.nutriments);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UserFormVoteComponent, {
      width: '50%',
      data : { productvote : this.productvote}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

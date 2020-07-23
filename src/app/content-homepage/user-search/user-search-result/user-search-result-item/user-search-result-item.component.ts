import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../../../shared/product.model';
import {MatDialog} from '@angular/material/dialog';
import {Web3Service} from '../../../../util/web3.service';
import {ModalProductDetailsComponent} from '../modal-product-details/modal-product-details.component';

@Component({
  selector: 'app-user-search-result-item',
  templateUrl: './user-search-result-item.component.html',
  styleUrls: ['./user-search-result-item.component.css']
})
export class UserSearchResultItemComponent implements OnInit {
  @Input() product: Product[];
  constructor(public dialog: MatDialog) {
  }


  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalProductDetailsComponent, {
      width: '50%',
      data: {product: this.product}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

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
// Component used in Homepage : an item of search result component
// Simple card used for some data displays and opening modify modal (modal-product-details)
export class UserSearchResultItemComponent implements OnInit {
  @Input() product: [Product, Product[]];
  actualProduct: Product;
  olderVersions: Product[] = [];

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.actualProduct = this.product[0];
    this.olderVersions = this.product[1];
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalProductDetailsComponent, {
      width: '50%',
      data: {product: this.actualProduct, olderVersions: this.olderVersions}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

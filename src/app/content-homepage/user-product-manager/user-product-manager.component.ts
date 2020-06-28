import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormInputProductComponent} from './form-input-product/form-input-product.component';

@Component({
  selector: 'app-user-product-manager',
  templateUrl: './user-product-manager.component.html',
  styleUrls: ['./user-product-manager.component.css']
})
export class UserProductManagerComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormInputProductComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}


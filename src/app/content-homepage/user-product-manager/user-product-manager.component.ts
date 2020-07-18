import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormInputProductComponent} from './form-input-product/form-input-product.component';
import {Web3Service} from '../../util/web3.service';

@Component({
  selector: 'app-user-product-manager',
  templateUrl: './user-product-manager.component.html',
  styleUrls: ['./user-product-manager.component.css']
})
export class UserProductManagerComponent implements OnInit {

  @ViewChild('div_inputAddProduct', {static: false}) div_inputAddProductRef: ElementRef;
  @ViewChild('div_inputUpdateProduct', {static: false}) div_inputUpdateProductRef: ElementRef;
  barcode: string;

  constructor(public dialog: MatDialog, private web3: Web3Service) {
  }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormInputProductComponent, {
      width: '50%',
      data: {codebarreValue: this.barcode}
    });

    /*  const sub = dialogRef.componentInstance.onAdd.subscribe(() => {
        // do something
      });*/

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.div_inputAddProductRef.nativeElement.style.display = 'none';
      this.div_inputUpdateProductRef.nativeElement.style.display = 'none';
      this.barcode = null;
    });
  }

  async checkStatusProduct(input_product_code) {
    const barcodeValue = input_product_code.value;
    if (Number(barcodeValue) && barcodeValue.length === 13) {
      const isNewProduct = await this.web3.contract.methods.checkProductIsNew(barcodeValue).call();
      console.log(isNewProduct);
      if (isNewProduct) {
        this.div_inputAddProductRef.nativeElement.style.display = 'block';
      } else {
        this.div_inputUpdateProductRef.nativeElement.style.display = 'block';
      }
    } else {
      this.div_inputAddProductRef.nativeElement.style.display = 'none';
      this.div_inputUpdateProductRef.nativeElement.style.display = 'none';
    }
  }
}


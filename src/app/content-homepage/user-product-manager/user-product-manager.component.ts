import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormInputProductComponent} from './form-input-product/form-input-product.component';
import {Web3Service} from '../../util/web3.service';
import {ModalProductDetailsComponent} from '../user-search/user-search-result/modal-product-details/modal-product-details.component';
import {Product} from '../../shared/product.model';
import {ServerSCService} from '../../server-sc.service';
import {ProductService} from '../../product.service';

@Component({
  selector: 'app-user-product-manager',
  templateUrl: './user-product-manager.component.html',
  styleUrls: ['./user-product-manager.component.css']
})
export class UserProductManagerComponent implements OnInit {

  @ViewChild('div_inputAddProduct', {static: false}) div_inputAddProductRef: ElementRef;
  @ViewChild('div_inputUpdateProduct', {static: false}) div_inputUpdateProductRef: ElementRef;
  barcode: string;
  private AcceptedProductArray: [Product, Product[]][] = [];
  compareProducts: Product[] = [];

  constructor(public dialog: MatDialog,
              private web3: Web3Service,
              private server_sc: ServerSCService,
              private product: ProductService
              ) {
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
    const barcodeValue = input_product_code.value.trim();
    if (Number(barcodeValue) && barcodeValue.length === 13) {
      const isNewProduct = await this.web3.contract.methods.checkProductIsNew(barcodeValue).call();
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

  async openDialogModify(input_product_code) {
    const that = this;
    const barcodeValue = {productCode : input_product_code.value.trim()};
    this.server_sc.getProductAndOlderVersions(barcodeValue).then( (result: []) => {
      for (let i = 0; i < result.length; i++) {
        const uniqueSqlResult = result[i] as any;
        console.log('Result ' + i + ':' + result[i]);
        const singleProduct = this.product.createProduct(uniqueSqlResult);
        if (uniqueSqlResult.status === 'ACCEPTED') {
          that.AcceptedProductArray[0] = [singleProduct, []];
        } else {
          that.AcceptedProductArray[0][1].push(singleProduct);
        }
      }
    }).then(async () => {
      const dialogRef = that.dialog.open(ModalProductDetailsComponent, {
        width: '50%',
        data: {product: that.AcceptedProductArray[0][0], olderVersions: that.AcceptedProductArray[0][1]}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.div_inputAddProductRef.nativeElement.style.display = 'none';
        this.div_inputUpdateProductRef.nativeElement.style.display = 'none';
        this.barcode = null;
      });
    });
   /* await this.web3.contract.methods.getProduct(barcodeValue).call().then(async (result) => {
      console.log('LE PRODUIT  : ' + result[1]);
      const start_date = new Date(result[0].created_t * 1000).toString();
      const end_date = new Date(result[0].endDate * 1000).toString();
      const product = new Product(
        result[0].productProposerAddress,
        result[0].productCode,
        result[0].productName,
        result[1],
        result[0].ingredients,
        result[0].quantity,
        result[0].typeOfProduct,
        result[0].packaging,
        result[0].labels,
        result[0].additifs,
        result[0].forVotes,
        result[0].againstVotes,
        result[0].alreadyVoted,
        result[0].startDate,
        result[0].endDate,
        result[0].status,
        result[0].all_hash
      );
      console.log('Status modify depuis manager : ' + result[0].status);
      if (parseInt(result[0].status, 10) === 3) {
        console.log('LALALALALALALALALALALALALA');
        await this.web3.contract.methods.getProduct(result[0].productCode).call().then(async (result2) => {
          const beforeModificationProduct = new Product(
            result2[0].productProposerAddress,
            result2[0].productCode,
            result2[0].productName,
            result2[1],
            result2[0].ingredients,
            result2[0].quantity,
            result2[0].typeOfProduct,
            result2[0].packaging,
            result2[0].labels,
            result2[0].additifs,
            result2[0].forVotes,
            result2[0].againstVotes,
            result2[0].alreadyVoted,
            result2[0].startDate,
            result2[0].endDate,
            result2[0].status,
            result[0].all_hash
          );
          that.compareProducts.push(product, beforeModificationProduct);
        });
      } else {
        that.compareProducts.push(product, null);
      }

      return new Promise((resolve) => {
        resolve();
      });
    }).then(async () => {
      const dialogRef = that.dialog.open(ModalProductDetailsComponent, {
        width: '50%',
        data: {product: that.compareProducts}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.div_inputAddProductRef.nativeElement.style.display = 'none';
        this.div_inputUpdateProductRef.nativeElement.style.display = 'none';
        this.barcode = null;
      });
    });*/
  }
}


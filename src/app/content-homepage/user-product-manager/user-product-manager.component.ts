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
// Component used in Homepage for managing input products (ADD/MODIFY) and opening modal
export class UserProductManagerComponent implements OnInit {

  // Accessing button div to display them
  @ViewChild('div_inputAddProduct', {static: false}) div_inputAddProductRef: ElementRef;
  @ViewChild('div_inputUpdateProduct', {static: false}) div_inputUpdateProductRef: ElementRef;
  // Barcode needed in input
  barcode: string;
  alreadyInVoteMessage: string;

  // Managing one or multiple product from Database
  private AcceptedProductArray: [Product, Product[]][] = [];

  // MatDialog for opening a Dialog, Web3Service for accessing the contract
  // ServerSCService to get database access, ProductService creating a product object
  constructor(public dialog: MatDialog,
              private web3: Web3Service,
              private server_sc: ServerSCService,
              private product: ProductService
  ) {
  }

  ngOnInit() {
  }

  // Open the dialog with a form to add a product
  openDialog(): void {
    const dialogRef = this.dialog.open(FormInputProductComponent, {
      width: '50%',
      data: {codebarreValue: this.barcode}
    });

    // Close modal
    dialogRef.afterClosed().subscribe(result => {
      this.div_inputAddProductRef.nativeElement.style.display = 'none';
      this.div_inputUpdateProductRef.nativeElement.style.display = 'none';
      this.barcode = null;
    });
  }

  // Check if product is totaly new (only in Smart Contract side)
  async checkStatusProduct(input_product_code) {
    this.alreadyInVoteMessage = '';
    const barcodeValue = input_product_code.value.trim();
    try {
      if (Number(barcodeValue) && barcodeValue.length === 13) {
        if (this.server_sc.serverUrl.endsWith(this.server_sc.port_SC)) {
          const isNewProduct = await this.web3.contract.methods.checkProductIsNew(barcodeValue).call();
          this.displayButtons(isNewProduct);
        } else if (this.server_sc.serverUrl.endsWith(this.server_sc.port)) {
          const object = {productCode: barcodeValue};
          this.server_sc.getSingleProduct(object).then((result: []) => {
            const uniqueSqlResult = result[-1] as any;
            if (result.length > 0 && uniqueSqlResult.status === 'ACCEPTED') {
              this.displayButtons(false);
            } else if (result.length === 0) {
              this.displayButtons(true);
            } else {
              this.alreadyInVoteMessage = 'Ce produit est en cours de vote : pas de modification, ni d\'ajout possible !';
            }
          });
          //   this.displayButtons(isNewProduct);
        }
      } else {
        this.div_inputAddProductRef.nativeElement.style.display = 'none';
        this.div_inputUpdateProductRef.nativeElement.style.display = 'none';
      }
    } catch (Error) {
      alert('Service inaccessible :' + Error.message);
    }
  }

  displayButtons(isNewProduct) {
    if (isNewProduct) {
      this.div_inputAddProductRef.nativeElement.style.display = 'block';
    } else {
      this.div_inputUpdateProductRef.nativeElement.style.display = 'block';
    }
  }

  // Open the dialog with a form to modify a product, also displaying older versions if there is
  async openDialogModify(input_product_code) {
    const that = this;
    const barcodeValue = {productCode: input_product_code.value.trim()};
    this.server_sc.getProductAndOlderVersions(barcodeValue).then((result: []) => {
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
        this.div_inputAddProductRef.nativeElement.style.display = 'none';
        this.div_inputUpdateProductRef.nativeElement.style.display = 'none';
        this.barcode = null;
      });
    })
      .catch(error => alert('Ressayer ulterieurement : ' + error));
  }
}


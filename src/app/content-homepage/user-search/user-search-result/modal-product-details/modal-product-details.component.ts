import {Component, Inject, OnInit, Optional} from '@angular/core';
import {Web3Service} from '../../../../util/web3.service';
import {ServerService} from '../../../../server.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../../../shared/product.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-modal-product-details',
  templateUrl: './modal-product-details.component.html',
  styleUrls: ['./modal-product-details.component.css']
})
export class ModalProductDetailsComponent implements OnInit {
  public product: Product[];
  public modifiedProduct: Product;
  visible = true;
  selectable = false;
  removable = false;
  addOnBlur = true;
  readOnly = true;
  sameObject = true;

//  newValues: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalProductDetailsComponent>,
              private web3: Web3Service,
              ) {
    console.log(data.product);
    this.product = data.product;
    this.modifiedProduct = JSON.parse(JSON.stringify(this.product[0]));
  }
    ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent, elType): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      switch (elType) {
        case 1:
          this.modifiedProduct.labels.push(value.trim());
          break;
        case 2:
          this.modifiedProduct.additifs.push(value.trim());
          break;
        case 3:
          this.modifiedProduct.ingredients.push(value.trim());
          break;
        default:
          break;
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.compareObjects();
  }

  remove(productElement: string, elType): void {
    let index;
    switch (elType) {
      case 1:
        index = this.modifiedProduct.labels.indexOf(productElement);
        this.modifiedProduct.labels.splice(index, 1);
        break;
      case 2:
        index = this.modifiedProduct.additifs.indexOf(productElement);
        this.modifiedProduct.additifs.splice(index, 1);
        break;
      case 3:
        index = this.modifiedProduct.ingredients.indexOf(productElement);
        this.modifiedProduct.ingredients.splice(index, 1);
        break;
      default:
        break;
    }
    this.compareObjects();
  }

  activateFields() {
    this.readOnly = !this.readOnly;
  }

  compareObjects () {
    this.sameObject = JSON.stringify(this.product[0]) === JSON.stringify(this.modifiedProduct);
  }

  modifyProduct() {
    const that = this;
    this.web3.contract.methods.addProductToProposal(
      this.modifiedProduct.code,
      this.modifiedProduct.product_name,
      this.modifiedProduct.labels,
      this.modifiedProduct.ingredients,
      this.modifiedProduct.quantity,
      this.modifiedProduct.generic_name,
      this.modifiedProduct.packaging,
      this.modifiedProduct.nutriments,
      this.modifiedProduct.additifs,
      3)
      .send({from: this.web3.accounts[0]})
      .on('receipt', function (receipt) {
        console.log(receipt);
        that.onNoClick();
        alert('Le produit suivant a été placé dans la liste d\'attente : '
          + that.modifiedProduct.code +
          ' - ' +
          that.modifiedProduct.product_name);
      });
  }

}

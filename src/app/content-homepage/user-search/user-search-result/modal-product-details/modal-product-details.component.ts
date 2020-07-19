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
  public product: Product;
  visible = true;
  selectable = false;
  removable = false;
  addOnBlur = true;
  public readOnly = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalProductDetailsComponent>) {
    this.product = data.product;
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
          this.product.labels.push(value.trim());
          break;
        case 2:
          this.product.additifs.push(value.trim());
          break;
        case 3:
          this.product.ingredients.push(value.trim());
          break;
        default:
          break;
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(productElement: string, elType): void {
    let index;
    switch (elType) {
      case 1:
        index = this.product.labels.indexOf(productElement);
        this.product.labels.splice(index, 1);
        break;
      case 2:
        index = this.product.additifs.indexOf(productElement);
        this.product.additifs.splice(index, 1);
        break;
      case 3:
        index = this.product.ingredients.indexOf(productElement);
        this.product.ingredients.splice(index, 1);
        break;
      default:
        break;
    }
  }

  activateModification() {
    this.readOnly = !this.readOnly;
  }

}

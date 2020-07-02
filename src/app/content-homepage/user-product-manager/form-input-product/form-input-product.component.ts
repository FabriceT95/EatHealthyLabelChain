import {Component, ElementRef, EventEmitter, Inject, OnInit, Optional, Output} from '@angular/core';
// import Quagga from 'quagga/dist/quagga.js';
import javascriptBarcodeReader from 'javascript-barcode-reader';
import {AppComponent} from '../../../app.component';
import {ServerService} from '../../../server.service';
import {Web3Service} from '../../../util/web3.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../../shared/product.model';

@Component({
  selector: 'app-form-input-product',
  templateUrl: './form-input-product.component.html',
  styleUrls: ['./form-input-product.component.css'],
})
export class FormInputProductComponent implements OnInit {
  codebarreProduct: number;
  constructor(
    private web3: Web3Service,
    private server: ServerService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormInputProductComponent>
  ) {
    this.codebarreProduct = data.codebarreValue;
  }

  ngOnInit() {
    // console.log(this.web3);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



  testQuaggaReading(codebarreInput) {
    const vi = codebarreInput.value;
    console.log(vi);
    const fileName = vi.split('\\')[-1];
    console.log('filename : ' + fileName);
    const path = 'C:/Users/Fabrice/Downloads/ean_codebarre.svg';
    console.log(path);

    // javascriptBarcodeReader({
    //   /* Image file Path || {data: Uint8ClampedArray, width, height} || HTML5 Canvas ImageData */
    //   image: path,
    //   barcode: 'ean',
    //   barcodeType: 'industrial',
    //   options: {
    //     useAdaptiveThreshold: true,
    //     singlePass: true
    //   }
    // })
    //   .then(code => {
    //     console.log(code);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  async readBarreCodeInputText(codebarreInputText) {
    /*  const barcodeValue = codebarreInputText.value;
      if (Number(barcodeValue) && barcodeValue.length === 13) {
        await this.web3.contract.methods.addProductToProposal(barcodeValue, 'ABAJOUR', 5 , [0]).send({from: this.web3.accounts[0]});
        this.web3.contract.events.TriggerAddProduct({
          fromBlock: await this.web3.web3.eth.getBlockNumber()
        }, function(error, event) { console.log(event.returnValues.idProduct); });
      }*/


  }

  async getProducts() {
    const barcodeValue = 1234567891234;
   // const product = await this.web3.contract.methods.getProduct(barcodeValue).call();
 //   console.log(product);
  }

  async addProductInDatabase(productName, proteines, glucide, salt, sugars, energy, energy_kcal, fiber,  fat, saturated_fat, sodium, ingredients, quantity, typeOfProduct, packaging, labels, additifs ) {
    console.log(energy.value);
    const newProduct = new Product(
          this.codebarreProduct,
          productName.value,
          {
            energy: energy.value,
            energy_kcal: energy_kcal.value,
            proteines: proteines.value,
            carbohydrates : glucide.value,
            salt : salt.value,
            sugars : sugars.value,
            fat: fat.value,
            saturated_fat: saturated_fat.value,
            fiber: fiber.value,
            sodium : sodium.value
          },
          ingredients.value.split(','),
          quantity.value,
          typeOfProduct.value,
          packaging.value.split(','),
          labels.value.split(','),
          additifs.value.split(',')
  );
      // Si Mysql Server is ON
    if (this.server.isChecked && !this.web3.isChecked) {
      newProduct.nutriments = JSON.stringify(newProduct.nutriments);
      this.server.createProduct(newProduct).then((result) => {
        console.log('Votre produit a été ajouté : ', result);
      });
    } else if (!this.server.isChecked && this.web3.isChecked) {
      const that = this;
       this.web3.contract.methods.addProductToProposal(
       newProduct.code,
       newProduct.product_name,
       newProduct.labels,
       newProduct.ingredient,
       newProduct.quantity,
       newProduct.generic_name,
       newProduct.packaging,
       newProduct.nutriments,
         newProduct.additifs)
       .send({from: this.web3.accounts[0]})
       .on('receipt', function(receipt) {
         console.log(receipt);
         that.onNoClick();
         alert('Le produit suivant a été placé dans la liste d\'attente : ' + newProduct.code + ' - ' + newProduct.product_name);
       });
      /*this.web3.contract.events.TriggerAddProduct({
        fromBlock: await this.web3.web3.eth.getBlockNumber()
      }, function(error, event) { console.log('Trigger Add Product : ' + event.returnValues.idProduct); })
        .on('data', function(event) {
          console.log("from data event " + event.returnValues.idProduct); // same results as the optional callback above
        });*/
    }


  //  } else {
  //    console.log('bonjour');
  //  }
  }

  addUserInDatabase(username, wallet) {
    const newUser = {username: username.value, wallet: wallet.value};
    this.server.createUser(newUser).then((result) => {
      console.log('Cet utilisateur a été ajouté : ', result);
    });
  }

  getProductFromDatabase(code) {
    const product = {code: code.value};
    this.server.getProduct(product).then((result) => {
      console.log('Retour de la requête GET PRODUCT : ', result);
    });
  }

  getUserFromDatabase(username) {
    const user = {username: username.value};
    this.server.getUser(user).then((result) => {
      console.log('Retour de la requête GET USER : ', result);
    });
  }

  updateUserFromDatabase(wallet, new_wallet, new_username) {
    const updateUser = {new_username: new_username.value, new_wallet: new_wallet.value, wallet: wallet.value};
    this.server.updateUser(updateUser).then((result) => {
      console.log('Retour de la requête UPDATE USER : ', result);
    });
  }

  updateProductFromDatabase(code, name) {
    const updateProduct = {code: code.value, name: name.value};
    this.server.updateProduct(updateProduct).then((result) => {
      console.log('Retour de la requête UPDATE PRODUCT : ', result);
    });
  }

  deleteUserFromDatabase(wallet) {
    const deleteUser = {wallet: wallet.value};
    this.server.deleteUser(deleteUser).then((result) => {
      console.log('Retour de la requête DELETE USER : ', result);
    });
  }

  deleteProductFromDatabase(code) {
    const deleteProduct = {code: code.value};
    this.server.deleteProduct(deleteProduct).then((result) => {
      console.log('Retour de la requête DELETE PRODUCT : ', result);
    });
  }

}

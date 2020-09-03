import {Component, ElementRef, EventEmitter, Inject, OnInit, Optional, Output} from '@angular/core';
// import Quagga from 'quagga/dist/quagga.js';
import javascriptBarcodeReader from 'javascript-barcode-reader';
import {AppComponent} from '../../../app.component';
import {ServerService} from '../../../server.service';
import {Web3Service} from '../../../util/web3.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../../shared/product.model';
import {ServerSCService} from '../../../server-sc.service';
import {ProductService} from '../../../product.service';
import keccak from 'keccak';


@Component({
  selector: 'app-form-input-product',
  templateUrl: './form-input-product.component.html',
  styleUrls: ['./form-input-product.component.css'],
})
export class FormInputProductComponent implements OnInit {
  codebarreProduct: number;

  constructor(
    private web3: Web3Service,
    private server_sc: ServerSCService,
    private product: ProductService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormInputProductComponent>
  ) {
    this.codebarreProduct = data.codebarreValue;
  }

  ngOnInit() {
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

  async addProduct(productName, proteines, glucide, salt, sugars, energy, energy_kcal, fiber,
                             fat, saturated_fat, sodium, ingredients, quantity, typeOfProduct, packaging, labels, additifs) {
    const newProduct = new Product(
      '',
      this.codebarreProduct,
      productName.value,
      {
        energy: energy.value,
        energy_kcal: energy_kcal.value,
        proteines: proteines.value,
        carbohydrates: glucide.value,
        salt: salt.value,
        sugar: sugars.value,
        fat: fat.value,
        saturated_fat: saturated_fat.value,
        fiber: fiber.value,
        sodium: sodium.value
      },
      ingredients.value.split(','),
      quantity.value,
      typeOfProduct.value,
      packaging.value,
      labels.value.split(','),
      additifs.value.split(','),
      0,
      0,
      {},
      null,
      null,
      1,
      ''
    );
    // Si Mysql Server is ON
    if (this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port)) {
      const labels_hash = keccak('keccak256').update(newProduct.labels).digest().toString('hex');
      const ingredients_hash = keccak('keccak256').update(newProduct.ingredients).digest().toString('hex');
      const additives_hash = keccak('keccak256').update(newProduct.additifs).digest().toString('hex');
      const nutriments_hash = keccak('keccak256').update(newProduct.nutriments).digest().toString('hex');
      const variousDatas_hash = keccak('keccak256').update(newProduct.code,
        newProduct.product_name,
        newProduct.generic_name,
        newProduct.quantity,
        newProduct.packaging).digest().toString('hex');
      const all_hash = keccak(labels_hash,
        ingredients_hash,
        additives_hash,
        nutriments_hash,
        variousDatas_hash).digest().toString('hex');
      console.log('variousdatas hash : ' + variousDatas_hash);
      this.addLabel(labels_hash, newProduct.labels.join(','));
      this.addIngredients(ingredients_hash, newProduct.ingredients.join(','));
      this.addAdditives(additives_hash, newProduct.additifs.join(','));
      this.addNutriments(nutriments_hash, JSON.stringify(newProduct.nutriments));
      this.addVariousDatas(variousDatas_hash, newProduct.code, newProduct.product_name, newProduct.generic_name, newProduct.quantity, newProduct.packaging);
      setTimeout(() => {
        this.addHashes(
          all_hash,
          this.web3.accounts[0],
          [Date.now() / 1000, Date.now() / 1000 + 300]
        );
      }, 500);
    } else if (!this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port_SC)) {
      const that = this;
      this.web3.contract.methods.addProductToProposal(
        newProduct.code,
        newProduct.labels,
        newProduct.ingredients,
        newProduct.additifs,
        newProduct.nutriments,
        newProduct.product_name,
        newProduct.generic_name,
        newProduct.quantity,
        newProduct.packaging
      )
        .send({from: this.web3.accounts[0]})
        .on('receipt', function (receipt) {
          that.addLabel(receipt.events.TriggerAddProduct.returnValues.hashes[0], newProduct.labels.join(','));
          that.addIngredients(receipt.events.TriggerAddProduct.returnValues.hashes[1], newProduct.ingredients.join(','));
          that.addAdditives(receipt.events.TriggerAddProduct.returnValues.hashes[2], newProduct.additifs.join(','));
          that.addNutriments(receipt.events.TriggerAddProduct.returnValues.hashes[3], JSON.stringify(newProduct.nutriments));
          that.addVariousDatas(
            receipt.events.TriggerAddProduct.returnValues.hashes[4],
            newProduct.code,
            newProduct.product_name,
            newProduct.generic_name,
            newProduct.quantity,
            newProduct.packaging
          );
          setTimeout(() => {
            that.addHashes(
              receipt.events.TriggerAddProduct.returnValues.hashes[5],
              receipt.events.TriggerAddProduct.returnValues.proposerProduct,
              receipt.events.TriggerAddProduct.returnValues.voteDates
            );
          }, 500);
          that.onNoClick();
          alert('Le produit suivant a été placé dans la liste d\'attente : ' + newProduct.code + ' - ' + newProduct.product_name);
        })
      .on('error', function(error, receipt) {
        alert('Erreur lors de l\'ajout de votre produit : ' + error.message + ' \n Merci de bien vouloir ré-essayer plus tard.');
      });
    }
  }

  addVariousDatas(variousData_hash, productCode, product_name, product_type, quantity, packaging) {
    const insertVariousDatas = {
      variousData_hash: variousData_hash,
      productCode: productCode,
      product_name: product_name,
      product_type: product_type,
      quantity: quantity,
      packaging: packaging
    };
    this.server_sc.addVariousDatas(insertVariousDatas).then((result) => {
      console.log('Les infos diverses et leur hash ont bien été ajouté à la BDD : ', result);
    });
  }

  addLabel(labels_hash, labels) {
    const insertLabels = {labels_hash: labels_hash, labels: labels};
    this.server_sc.addLabels(insertLabels).then((result) => {
      console.log('Les labels et leur hash ont bien été ajouté à la BDD : ', result);
    });
  }

  addAdditives(additives_hash, additives) {
    const insertAdditives = {additives_hash: additives_hash, additives: additives};
    this.server_sc.addAdditives(insertAdditives).then((result) => {
      console.log('Les additifs et leur hash ont bien été ajouté à la BDD : ', result);
    });
  }

  addIngredients(ingredients_hash, ingredients) {
    const insertIngredients = {ingredients_hash: ingredients_hash, ingredients: ingredients};
    this.server_sc.addIngredients(insertIngredients).then((result) => {
      console.log('Les ingredients et leur hash ont bien été ajouté à la BDD : ', result);
    });
  }

  addNutriments(nutriments_hash, nutriments) {
    const insertNutriments = {nutriments_hash: nutriments_hash, nutriments: nutriments};
    this.server_sc.addNutriments(insertNutriments).then((result) => {
      console.log('Les nutriments et leur hash ont bien été ajouté à la BDD : ', result);
    });
  }

  addHashes(all_hash, addressProposer, voteDates) {
    const insertHashes = {
      all_hash: all_hash,
      addressProposer: addressProposer,
      voteDates: voteDates,
      status: 'NEW'
    };
    this.server_sc.addHashes(insertHashes).then((result) => {
      console.log('Les hashes ont bien été ajouté à la BDD : ', result);
    });
  }
}

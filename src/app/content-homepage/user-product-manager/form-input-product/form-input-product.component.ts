import {Component, ElementRef, Inject, OnInit, Optional, ViewChild} from '@angular/core';
// import Quagga from 'quagga/dist/quagga.js';
import javascriptBarcodeReader from 'javascript-barcode-reader';
import {Web3Service} from '../../../util/web3.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../../shared/product.model';
import {ServerSCService} from '../../../server-sc.service';
import {ProductService} from '../../../product.service';
import keccak from 'keccak';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FileUploader} from 'ng2-file-upload';





@Component({
  selector: 'app-form-input-product',
  templateUrl: './form-input-product.component.html',
  styleUrls: ['./form-input-product.component.css'],
})
export class FormInputProductComponent implements OnInit {
  codebarreProduct: number;
  uploader: FileUploader = new FileUploader({url: this.server_sc.serverUrl + '/addfile',
    headers: [
      {name : 'Access-Control-Allow-Methods', value: 'POST, GET, PATCH, DELETE, OPTIONS'},
      {name: 'Access-Control-Allow-Origin' , value:  this.server_sc.serverUrl}]});
  attachmentList: any = {};
  imageProduct: string;

  constructor(
    private web3: Web3Service,
    private server_sc: ServerSCService,
    private product: ProductService,
    private http: HttpClient,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormInputProductComponent>
  ) {
    this.codebarreProduct = data.codebarreValue;
    this.uploader.onCompleteItem = (item: any, response: any, status: any, header: any) => {
      this.attachmentList = JSON.parse(response);
      console.log(this.attachmentList.file[0].hash);
      this.server_sc.getFile({hash_code: this.attachmentList.file[0].hash}).then((result: {}) => {
        console.log(result['content']['data']);
        this.imageProduct = this.toBase64(result['content']['data']);
      });
    };
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
  }

  toBase64(arr) {
    return btoa(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  testUpload(fileInputEvent: any) {
  /*  this.selectedFile = <File>fileInputEvent.target.files[0];
   const fd = new FormData();
   fd.append('image', this.selectedFile, this.selectedFile.name);
   this.http.post(`${this.server_sc.serverUrl}/addfile/${fd}/`, fd)
     .subscribe(res => { console.log(res); });
*/
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
      null
    );
    // Si Mysql Server is ON
    if (this.server_sc.serverUrl.endsWith(this.server_sc.port)) {
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
      this.addVariousDatas(variousDatas_hash, newProduct.code, newProduct.product_name, newProduct.generic_name, newProduct.quantity, newProduct.packaging, '');
      setTimeout(() => {
        this.addHashes(
          all_hash,
          this.web3.accounts[0],
          [Date.now() / 1000, Date.now() / 1000 + 300]
        );
      }, 500);
    } else if (this.server_sc.serverUrl.endsWith(this.server_sc.port_SC)) {
      const that = this;
      const hash_ipfs = this.attachmentList.file[0].hash;
      if (!hash_ipfs.startsWith('Qm')) {
        alert('Veuillez insérer une image des composants de votre produit');
        return;
      }
      newProduct.IPFS_hash = hash_ipfs;
      this.web3.contract.methods.addProductToProposal(
        newProduct.code,
        newProduct.labels,
        newProduct.ingredients,
        newProduct.additifs,
        newProduct.nutriments,
        newProduct.product_name,
        newProduct.generic_name,
        newProduct.quantity,
        newProduct.packaging,
        newProduct.IPFS_hash
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
            newProduct.packaging,
            newProduct.IPFS_hash
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

  addVariousDatas(variousData_hash, productCode, product_name, product_type, quantity, packaging, IPFS_hash) {
    const insertVariousDatas = {
      variousData_hash: variousData_hash,
      productCode: productCode,
      product_name: product_name,
      product_type: product_type,
      quantity: quantity,
      packaging: packaging,
      IPFS_hash: IPFS_hash
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

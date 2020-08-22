import {Component, Inject, OnInit, Optional} from '@angular/core';
import {Web3Service} from '../../../../util/web3.service';
import {ServerService} from '../../../../server.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../../../shared/product.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {ServerSCService} from '../../../../server-sc.service';

interface Alternative {
  product_name: string;
  product_code_alternative: number;
  for_votes: number;
  against_votes: number;
  opinion?: any;
}

@Component({
  selector: 'app-modal-product-details',
  templateUrl: './modal-product-details.component.html',
  styleUrls: ['./modal-product-details.component.css']
})
export class ModalProductDetailsComponent implements OnInit {
  public product: Product;
  public modifiedProduct: Product;
  public olderVersions: Product[];
  public alternatives: { [productCode: number]: Alternative } = {};
  inProgress = false;
  visible = true;
  selectable = false;
  removable = false;
  addOnBlur = true;
  readOnly = true;
  sameObject = true;
  panelOpenState_product_name = false;
  panelOpenState_labels = false;
  panelOpenState_additifs = false;
  panelOpenState_ingredients = false;
  panelOpenState_nutriments = false;
  panelOpenState_generic_name = false;
  panelOpenState_packaging = false;
  panelOpenState_quantity = false;
  verifiedProduct: boolean;
  displayAddAlternativeField = false;
  displayAlternativeInputResult = '';
  displayDefaultResponseInputResult = '';

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalProductDetailsComponent>,
              private web3: Web3Service,
              private server_sc: ServerSCService
  ) {
    console.log(data.product);
    this.product = data.product;
    this.modifiedProduct = JSON.parse(JSON.stringify(this.product));
    this.olderVersions = data.olderVersions;
    console.log('OLDERS : ' + this.olderVersions);
  }

  ngOnInit() {
    const lastVerifDate = new Date(this.product.lastVerification);
    this.product.lastVerification = lastVerifDate.setDate(lastVerifDate.getDate() + 7);
    this.verifiedProduct = new Date(this.product.lastVerification).getTime() > Date.now();
    console.log('Date de validité jusqu"au : ' + new Date(this.product.lastVerification).getTime());
    console.log('Date du jour : ' + Date.now());
    console.log('vérification établie : ' + this.verifiedProduct);
    this.getAlternatives();


  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async checkProductExists(input_product_code) {
    const that = this;
    const barcodeValue = input_product_code.value.trim();
    if (Number(barcodeValue) === this.product.code) {
      that.displayDefaultResponseInputResult = 'Vous ne pouvez pas faire ça !';
    } else if (Number(barcodeValue) && barcodeValue.length === 13) {
      const product_exists = {
        productCode: barcodeValue,
      };
      this.server_sc.getProduct(product_exists).then((result: any) => {
        console.log('Get product :' + JSON.stringify(result[0]));
        console.log(that.alternatives);
        if (result.length === 1 && !(result[0].product_code in that.alternatives)) {
          that.displayAlternativeInputResult = result[0].product_name;
        } else if (result.length === 0) {
          that.displayDefaultResponseInputResult = barcodeValue + ' : Ce code-barre n\'existe pas';
        } else {
          that.displayDefaultResponseInputResult = barcodeValue + ' : Ce produit est déjà une alternative';
        }
      });
    }
  }

  async getAlternatives() {
   const alternative_object = {
      productCode: this.product.code,
     user_address: this.web3.accounts[0]
    };
    this.server_sc.getAlternatives(alternative_object).then((result: any) => {
      for (let i = 0; i < result.length; i++) {
        const uniqueSqlResult = result[i] as any;
       // console.log('Result ' + i + ':' + JSON.stringify(uniqueSqlResult));
        this.alternatives[uniqueSqlResult.product_code] = {
          product_name: uniqueSqlResult.product_name,
          product_code_alternative: uniqueSqlResult.product_code,
          for_votes: uniqueSqlResult.for_votes,
          against_votes: uniqueSqlResult.against_votes
        };
      }
      this.server_sc.getAlternatives_voter_for_product(alternative_object).then((result_2: any) => {
        for (let i = 0; i < result_2.length; i++) {
          const uniqueSqlResult = result_2[i] as any;
          this.alternatives[uniqueSqlResult.product_code].opinion = uniqueSqlResult.opinion;
          console.log(uniqueSqlResult.opinion);
        }
        console.log(this.alternatives);
      });
    });


  }

  async addAlternative(product_code_alternative) {
    const that = this;
    const product_object = {
      productCode : this.product.code,
      productCode_alternative : product_code_alternative.value.trim()
    };
    this.server_sc.addAlternative(product_object).then(() => {
      that.getAlternatives();
    });
  }

  async voteAlternative(product_code_alternative, opinion) {
    console.log(product_code_alternative);
    console.log('cette alternative : ' + this.alternatives[product_code_alternative]);
    const previous_opinion = this.alternatives[product_code_alternative].opinion;
    const product_vote_object = {
      productCode : this.product.code,
      user_address : this.web3.accounts[0],
      all_hash : this.product.all_hash,
      productCode_alternative : product_code_alternative,
      opinion : opinion ? 1 : -1,
      prev_opinion : previous_opinion === undefined ? 0 : (previous_opinion ? 1 : -1),
    };

    this.server_sc.addVoteAlternative(product_vote_object).then(() => {
      console.log('Nouveau vote pour ce produit : ' + product_vote_object.productCode);
      this.server_sc.UpdateVoteAlternative(product_vote_object).then(() => {
        this.getAlternatives();


      });
    });


  }

  async verifyCompliance() {
    this.inProgress = true;
    console.log(JSON.stringify(this.product));
    const nutriments = {
      energy: this.product.nutriments.energy.toString(),
      energy_kcal: this.product.nutriments.energy_kcal.toString(),
      proteines: this.product.nutriments.proteines.toString(),
      carbohydrates: this.product.nutriments.carbohydrates.toString(),
      salt: this.product.nutriments.salt.toString(),
      sugar: this.product.nutriments.sugar.toString(),
      fat: this.product.nutriments.fat.toString(),
      saturated_fat: this.product.nutriments.saturated_fat.toString(),
      fiber: this.product.nutriments.fiber.toString(),
      sodium: this.product.nutriments.sodium.toString(),
    };
    const product_hashes_contrat = await this.web3.contract.methods.getProductHashes(this.product.code)
      .call({from: this.web3.accounts[0]});
    const product_hashes_DB = await this.web3.contract.methods.verifyCompliance(
      this.product.code,
      this.product.labels,
      this.product.ingredients,
      this.product.additifs,
      nutriments,
      this.product.product_name,
      this.product.generic_name,
      this.product.quantity,
      this.product.packaging
    ).call({from: this.web3.accounts[0]});
    this.compareHashes(product_hashes_contrat, product_hashes_DB);
  }

  compareHashes(product_hashes_contrat, product_hashes_DB) {
    try {
      if (product_hashes_contrat[1] !== product_hashes_DB[1]) {
        console.log('Les labels ne sont pas conforme');
      } else if (product_hashes_contrat[2] !== product_hashes_DB[2]) {
        console.log('Les ingredients ne sont pas conforme');
      } else if (product_hashes_contrat[3] !== product_hashes_DB[3]) {
        console.log('Les additifs ne sont pas conforme');
      } else if (product_hashes_contrat[4] !== product_hashes_DB[4]) {
        console.log('Les nutriments ne sont pas conforme');
      } else if (product_hashes_contrat[5] !== product_hashes_DB[5]) {
        console.log('Les divers ne sont pas conforme');
      } else {
        console.log('L\'article est conforme !');
        const verification_object = {
          productCode: this.product.code,
          lastVerificationDate: Math.floor(Date.now() / 1000 + 604800)
        };
        this.server_sc.setVerification(verification_object).then(() => {
          console.log('La date de vérification a bien été modifée. Elle est active pendant une semaine');
        });
      }
      this.inProgress = false;
    } catch (err) {
      console.log(err);
    }
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

  compareObjects() {
    this.sameObject = JSON.stringify(this.product) === JSON.stringify(this.modifiedProduct);
  }

  modifyProduct() {
    const that = this;
    const json = JSON.stringify(this.modifiedProduct.nutriments);
    this.modifiedProduct.nutriments = JSON.parse(json, (key, val) => (
      typeof val !== 'object' && val !== null ? String(val) : val
    ));
    this.web3.contract.methods.addProductToProposal(
      this.modifiedProduct.code,
      this.modifiedProduct.labels,
      this.modifiedProduct.ingredients,
      this.modifiedProduct.additifs,
      this.modifiedProduct.nutriments,
      this.modifiedProduct.product_name,
      this.modifiedProduct.generic_name,
      this.modifiedProduct.quantity,
      this.modifiedProduct.packaging
    )
      .send({from: this.web3.accounts[0]})
      .on('receipt', function (receipt) {
        console.log('VOYOJIFJDLZ : ' + receipt.events.TriggerAddProduct.returnValues.hashes);
        console.log('Proposer : ' + receipt.events.TriggerAddProduct.returnValues.proposerProduct);
        console.log('1234 : ' + receipt.events.TriggerAddProduct.returnValues.voteDates[0]);
        console.log('5678 : ' + receipt.events.TriggerAddProduct.returnValues.voteDates[1]);
        that.addLabel_SC(receipt.events.TriggerAddProduct.returnValues.hashes[0], that.modifiedProduct.labels.join(','));
        that.addIngredients(receipt.events.TriggerAddProduct.returnValues.hashes[1], that.modifiedProduct.ingredients.join(','));
        that.addAdditives(receipt.events.TriggerAddProduct.returnValues.hashes[2], that.modifiedProduct.additifs.join(','));
        that.addNutriments(receipt.events.TriggerAddProduct.returnValues.hashes[3], JSON.stringify(that.modifiedProduct.nutriments));
        that.addVariousDatas(
          receipt.events.TriggerAddProduct.returnValues.hashes[4],
          that.modifiedProduct.code,
          that.modifiedProduct.product_name,
          that.modifiedProduct.generic_name,
          that.modifiedProduct.quantity,
          that.modifiedProduct.packaging
        );
        setTimeout(() => {
          that.addHashes(
            receipt.events.TriggerAddProduct.returnValues.hashes[5],
            receipt.events.TriggerAddProduct.returnValues.proposerProduct,
            receipt.events.TriggerAddProduct.returnValues.voteDates
          );
        }, 500);
        that.onNoClick();
        //  alert('Le produit suivant a été placé dans la liste d\'attente : ' + newProduct.code + ' - ' + newProduct.product_name);
        that.onNoClick();
        alert('Le produit suivant a été placé dans la liste d\'attente : '
          + that.modifiedProduct.code +
          ' - ' +
          that.modifiedProduct.product_name);
      });
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

  addLabel_SC(labels_hash, labels) {
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
      status: 'IN_MODIFICATION'
    };
    this.server_sc.addHashes(insertHashes).then((result) => {
      console.log('Les hashes ont bien été ajouté à la BDD : ', result);
    });
  }
}

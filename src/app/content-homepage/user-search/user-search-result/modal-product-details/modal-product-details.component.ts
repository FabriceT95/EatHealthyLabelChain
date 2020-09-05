import {Component, Inject, OnInit, Optional} from '@angular/core';
import {Web3Service} from '../../../../util/web3.service';
import {ServerService} from '../../../../server.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../../../shared/product.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {ServerSCService} from '../../../../server-sc.service';
import keccak from 'keccak';
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
// Component used in Homepage/Search results items : openable modal for display product to modify
// and propose/see alternatives to the product selected
export class ModalProductDetailsComponent implements OnInit {
  public product: Product;
  public modifiedProduct: Product;
  public olderVersions: Product[];
  public productImage;
  public alternatives: { [productCode: number]: Alternative } = {};
  public topAlternatives: { [productCode: number]: Alternative } = {};
  public freshAlternatives: { [productCode: number]: Alternative } = {};
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
  isAlreadyBeingModified = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  // MatDialog for opening a Dialog, Web3Service for accessing the contract
  // ServerSCService to get database access
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalProductDetailsComponent>,
              private web3: Web3Service,
              private server_sc: ServerSCService
  ) {
    this.product = data.product;
    this.modifiedProduct = JSON.parse(JSON.stringify(this.product));
    this.olderVersions = data.olderVersions;
  }

  // Check if product has been verify by a user the last 7 days
  ngOnInit() {
    if (this.server_sc.serverUrl.endsWith(this.server_sc.port_SC)) {
      const lastVerifDate = new Date(this.product.lastVerification);
      this.verifiedProduct = new Date(lastVerifDate.setDate(lastVerifDate.getDate() + 7)).getTime() > Date.now();
    } else {
      this.verifiedProduct = true;
    }
    this.getAlternatives();
    this.checkAlreadyBeingModified();
    this.server_sc.getFile({file: this.product.IPFS_hash}).then((result: {}) => {
      console.log(result);
      // this.productImage = btoa(result['file']['content']['data']);
    });


  }
  // Closes dialog
  onNoClick(): void {
    this.dialogRef.close();
  }
  // Alternative input : checks if product exists or already an alternative
  checkProductExists(input_product_code) {
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
          this.displayDefaultResponseInputResult = '';
        } else if (result.length === 0) {
          that.displayDefaultResponseInputResult = barcodeValue + ' : Ce code-barre n\'existe pas';
        } else {
          that.displayDefaultResponseInputResult = barcodeValue + ' : Ce produit est déjà une alternative';
        }
      });
    } else {
      this.displayDefaultResponseInputResult = '';
      this.displayAlternativeInputResult = '';
    }
  }

  // Get product selected alternatives
  getAlternatives() {
   const alternative_object = {
      productCode: this.product.code,
     user_address: this.web3.accounts[0]
    };
    this.server_sc.getAlternatives(alternative_object).then((result: any) => {
      const top_alternatives = result.slice(0, 5);
      const fresh_alternatives = result.slice(5, -1);
      if (top_alternatives.length > 0) {
        this.dispatchAlternatives(top_alternatives, this.topAlternatives, alternative_object);
      }
      if (fresh_alternatives.length > 0) {
        this.dispatchAlternatives(fresh_alternatives, this.freshAlternatives, alternative_object);
      }
    });
  }
  // Alternatives can be split into two categories : Top alternatives and New alternatives (less than 7 days)
  dispatchAlternatives(alternatives_array, dict, alternative_object) {
    for (let i = 0; i < alternatives_array.length; i++) {
      const uniqueSqlResult = alternatives_array[i] as any;
      dict[uniqueSqlResult.product_code] = {
        product_name: uniqueSqlResult.product_name,
        product_code_alternative: uniqueSqlResult.product_code,
        for_votes: uniqueSqlResult.for_votes,
        against_votes: uniqueSqlResult.against_votes
      };
    }
    this.server_sc.getAlternatives_voter_for_product(alternative_object).then((result_2: any) => {
      for (let i = 0; i < result_2.length; i++) {
        const uniqueSqlResult = result_2[i] as any;
        dict[uniqueSqlResult.product_code_alternative].opinion = uniqueSqlResult.opinion;
      }
    });
  }

  // Allow the user to add a new alternative
  addAlternative(product_code_alternative) {
    const that = this;
    const product_object = {
      productCode : this.product.code,
      productCode_alternative : product_code_alternative.value.trim()
    };
    this.server_sc.addAlternative(product_object).then(() => {
      that.getAlternatives();
      this.displayAlternativeInputResult = '';
    });
  }

  // Allow the user to vote for an alternative
  voteAlternative(product_code_alternative, opinion, tendance) {
    console.log('les alternatives : ' + JSON.stringify(this.alternatives));
    console.log(product_code_alternative);
    console.log('cette alternative : ' +  this.topAlternatives[product_code_alternative]);
    const previous_opinion = tendance === 'top' ?
      this.topAlternatives[product_code_alternative].opinion :
      this.freshAlternatives[product_code_alternative].opinion;
    const product_vote_object = {
      productCode : this.product.code,
      user_address : this.web3.accounts[0],
      all_hash : this.product.all_hash,
      productCode_alternative : product_code_alternative,
      opinion : opinion ? 1 : -1,
      prev_opinion : previous_opinion !== undefined ? previous_opinion : 0,
    };

    this.server_sc.addVoteAlternative(product_vote_object).then(() => {
      console.log('Nouveau vote pour ce produit : ' + product_vote_object.productCode);
      this.server_sc.UpdateVoteAlternative(product_vote_object).then(() => {
        this.getAlternatives();
      });
    });
  }

  // Before a user can modify a product, it checks the product status :
  // it can't be modified if already in modification status
  checkAlreadyBeingModified () {
    const checkAlreadyBeingModified_object = {
      productCode : this.product.code
    };
    this.server_sc.getCheckModificationStatus(checkAlreadyBeingModified_object).then((result) => {
      const uniqueSqlResult = result as any;
      if (uniqueSqlResult.length === 1) {
        this.isAlreadyBeingModified = true;
      }
    });
  }

  // Allows the user to check if a product has not been corrupted,
  // update the compliance into the DB for 7 days
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
    try {
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
    } catch (Error) {
      alert('Serveur inaccessible : ré-essayez plus tard !');
    }
  }

  // Compare hashes of each category and verify unity between Smart contract and DB
  compareHashes(product_hashes_contrat, product_hashes_DB) {
      let corrupted = true;
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
        corrupted = false;
        console.log('L\'article est conforme !');
        const verification_object = {
          productCode: this.product.code,
          lastVerificationDate: Math.floor(Date.now() / 1000 + 604800)
        };
        this.server_sc.setVerification(verification_object).then(() => {
          console.log('La date de vérification a bien été modifée. Elle est active pendant une semaine');
        })
          .catch(() => alert('Vérification non mise à jour (Erreur DB), veuillez ré-essayer ulterieurement'));
      }
      if (corrupted) {
        this.setProductToCorrupted();
      }
      this.inProgress = false;
  }

  // set Product to corrupted status
  setProductToCorrupted() {
    const setCorrupted_object = {
      productCode : this.product.code
    };
    this.server_sc.setCorrupted(setCorrupted_object).then(() => {
      console.log('Produit corrumpu : incohérence de la DB et de la BC');
    });

  }

  // Brings element to modify into specified array
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

  // Remove element to remove from specified array
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

  // Allows user to enable inputs which are initially disabled
  activateFields() {
    this.readOnly = !this.readOnly;
    this.modifiedProduct = JSON.parse(JSON.stringify(this.product));
    this.compareObjects();
    console.log(this.modifiedProduct);
    console.log(this.product);
  }

  // Compare product initially opened and modified product by user
  compareObjects() {
    this.sameObject = JSON.stringify(this.product) === JSON.stringify(this.modifiedProduct);
    console.log(JSON.stringify(this.product));
    console.log(JSON.stringify(this.modifiedProduct));
    console.log('Meme objet ?  : ' + this.sameObject);
  }

  // Sends product modified by user into the contract and DB then it will be voted by users
  async modifyProduct() {
    this.checkAlreadyBeingModified();
    if (this.isAlreadyBeingModified === false) {
      const that = this;
      const json = JSON.stringify(this.modifiedProduct.nutriments);
      this.modifiedProduct.nutriments = JSON.parse(json, (key, val) => (
        typeof val !== 'object' && val !== null ? String(val) : val
      ));
      if (!this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port)) {
        try {
          const labels_hash = keccak('keccak256').update(this.modifiedProduct.labels).digest().toString('hex');
          const ingredients_hash = keccak('keccak256').update(this.modifiedProduct.ingredients).digest().toString('hex');
          const additives_hash = keccak('keccak256').update(this.modifiedProduct.additifs).digest().toString('hex');
          const nutriments_hash = keccak('keccak256').update(this.modifiedProduct.nutriments).digest().toString('hex');
          const variousDatas_hash = keccak('keccak256').update(this.modifiedProduct.code,
            this.modifiedProduct.product_name,
            this.modifiedProduct.generic_name,
            this.modifiedProduct.quantity,
            this.modifiedProduct.packaging).digest().toString('hex');
          const all_hash = keccak(labels_hash,
            ingredients_hash,
            additives_hash,
            nutriments_hash,
            variousDatas_hash).digest().toString('hex');
          console.log('Hash variousDatas : ' + variousDatas_hash);
          this.addLabel(labels_hash, this.modifiedProduct.labels.join(','));
          this.addIngredients(ingredients_hash, this.modifiedProduct.ingredients.join(','));
          this.addAdditives(additives_hash, this.modifiedProduct.additifs.join(','));
          this.addNutriments(nutriments_hash, JSON.stringify(this.modifiedProduct.nutriments));
          this.addVariousDatas(variousDatas_hash, this.modifiedProduct.code,
            this.modifiedProduct.product_name,
            this.modifiedProduct.generic_name,
            this.modifiedProduct.quantity,
            this.modifiedProduct.packaging);
          setTimeout(() => {
            this.addHashes(
              all_hash,
              this.web3.accounts[0],
              [Date.now() / 1000, Date.now() / 1000 + 300]
            );
          }, 500);
        } catch (error) {
          alert('Erreur lors de la modification du produit : ' + error.message + ' \n Merci de bien vouloir ré-essayer plus tard.');
        }
      } else if (this.server_sc.isChecked && this.server_sc.serverUrl.endsWith(this.server_sc.port_SC)) {
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
            that.addLabel(receipt.events.TriggerAddProduct.returnValues.hashes[0], that.modifiedProduct.labels.join(','));
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
            alert('Le produit suivant a été placé dans la liste d\'attente : '
              + that.modifiedProduct.code +
              ' - ' +
              that.modifiedProduct.product_name);
          })
          .on('error', function (error, receipt) {
            alert('Erreur lors de la modification : ré-essayer ulterieurement');
          });
      }
    } else {
      alert('Vous ne pouvez pas faire ça, le produit est déjà en cours de vote');
    }
  }

  // Sends data and hash of these data to DB
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

  // Sends data and hash of these data to DB
  addLabel(labels_hash, labels) {
    const insertLabels = {labels_hash: labels_hash, labels: labels};
    this.server_sc.addLabels(insertLabels).then((result) => {
      console.log('Les labels et leur hash ont bien été ajouté à la BDD : ', result);
    });
  }

  // Sends data and hash of these data to DB
  addAdditives(additives_hash, additives) {
    const insertAdditives = {additives_hash: additives_hash, additives: additives};
    this.server_sc.addAdditives(insertAdditives).then((result) => {
      console.log('Les additifs et leur hash ont bien été ajouté à la BDD : ', result);
    });
  }

  // Sends data and hash of these data to DB
  addIngredients(ingredients_hash, ingredients) {
    const insertIngredients = {ingredients_hash: ingredients_hash, ingredients: ingredients};
    this.server_sc.addIngredients(insertIngredients).then((result) => {
      console.log('Les ingredients et leur hash ont bien été ajouté à la BDD : ', result);
    });
  }

  // Sends data and hash of these data to DB
  addNutriments(nutriments_hash, nutriments) {
    const insertNutriments = {nutriments_hash: nutriments_hash, nutriments: nutriments};
    this.server_sc.addNutriments(insertNutriments).then((result) => {
      console.log('Les nutriments et leur hash ont bien été ajouté à la BDD : ', result);
    });
  }

  // Sends all hashes in a unique DB table
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

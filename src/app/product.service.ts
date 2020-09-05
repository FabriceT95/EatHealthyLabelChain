import { Injectable } from '@angular/core';
import {Product} from './shared/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  createProduct(element) {
    return new Product(
      element.address_proposer,
      element.product_code,
      element.product_name,
      {
        carbohydrates: element.carbohydrates,
        energy: element.energy,
        energy_kcal: element.energy_kcal,
        fat: element.fat,
        fiber: element.fiber,
        proteines: element.proteines,
        salt: element.salt,
        saturated_fat: element.saturated_fat,
        sodium: element.sodium,
        sugar: element.sugar
      },
      element.ingredients.split(','),
      element.quantity,
      element.product_type,
      element.packaging,
      element.labels.split(','),
      element.additives.split(','),
      element.forVotes,
      element.againstVotes,
      element.alreadyVoted,
      element.start_date,
      element.end_date,
      element.status,
      element.all_hash,
      element.labels_hash,
      element.ingredients_hash,
      element.additives_hash,
      element.nutriments_hash,
      element.variousDatas_hash,
      element.lastVerificationDate,
      element.IPFS_hash
    );
  }
}

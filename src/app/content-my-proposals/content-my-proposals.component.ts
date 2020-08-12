import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Product} from '../shared/product.model';
import {ServerSCService} from '../server-sc.service';
import {ProductService} from '../product.service';

@Component({
  selector: 'app-content-my-proposals',
  templateUrl: './content-my-proposals.component.html',
  styleUrls: ['./content-my-proposals.component.css']
})
export class ContentMyProposalsComponent implements OnInit {
  UserProductsProposal: Product[] = [];

  constructor(private web3: Web3Service,
              private server_sc: ServerSCService,
              private product: ProductService
              ) {
  }

  ngOnInit() {
    this.getMyProposals();
    setInterval(() => {
      this.getMyProposals();
    }, 5000);
  }

  getMyProposals() {
    const user_description = {
      user_address: this.web3.accounts[0]
    };
    this.server_sc.getMyProposals(user_description).then((result: Product[]) => {
      this.UserProductsProposal = [];
      for (let i = 0; i < result.length; i++) {
        const uniqueSqlResult = result[i] as any;
        // const start_date = new Date(uniqueSqlResult.start_date * 1000);
        // const end_date = new Date(uniqueSqlResult.end_date * 1000).toString();
        console.log('Result ' + i + ':' + result[i]);
        const singleProduct = this.product.createProduct(uniqueSqlResult);
          /*new Product(
          uniqueSqlResult.address_proposer,
          uniqueSqlResult.productCode,
          uniqueSqlResult.product_name,
          {
            carbohydrates: uniqueSqlResult.carbohydrates,
            energy: uniqueSqlResult.energy,
            energy_kcal: uniqueSqlResult.energy_kcal,
            fat: uniqueSqlResult.fat,
            fiber: uniqueSqlResult.fiber,
            proteines: uniqueSqlResult.proteines,
            salt: uniqueSqlResult.salt,
            saturated_fat: uniqueSqlResult.saturated_fat,
            sodium: uniqueSqlResult.sodium,
            sugar: uniqueSqlResult.sugar
          },
          uniqueSqlResult.ingredients.split(','),
          uniqueSqlResult.quantity,
          uniqueSqlResult.product_type,
          uniqueSqlResult.packaging,
          uniqueSqlResult.label.split(','),
          uniqueSqlResult.additive.split(','),
          uniqueSqlResult.forVotes,
          uniqueSqlResult.againstVotes,
          uniqueSqlResult.alreadyVoted,
          uniqueSqlResult.start_date,
          uniqueSqlResult.end_date,
          uniqueSqlResult.status,
          uniqueSqlResult.all_hash
        );*/
        this.UserProductsProposal.push(singleProduct);
      }
    });
  }

}

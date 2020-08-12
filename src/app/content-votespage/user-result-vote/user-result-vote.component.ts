import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Product} from '../../shared/product.model';
import {Web3Service} from '../../util/web3.service';
import {ServerService} from '../../server.service';
import {ServerSCService} from '../../server-sc.service';
import {ProductService} from '../../product.service';

@Component({
  selector: 'app-user-result-vote',
  templateUrl: './user-result-vote.component.html',
  styleUrls: ['./user-result-vote.component.css']
})
export class UserResultVoteComponent implements OnInit {
  ProductsVoting: Product[] = [];

  constructor(private web3: Web3Service,
              private server: ServerService,
              private server_sc: ServerSCService,
              private product: ProductService) {
  }


  ngOnInit() {
    setTimeout(async () => {
      this.getAllVotingProducts();
      this.web3.newVote.subscribe(
        () => {
          this.ProductsVoting = [];
          this.getAllVotingProducts();
        }
      );
    }, 100);
    this.server_sc.content_vote_page_change.subscribe(
      (ProductVoteSearch: Product[]) => {
        this.ProductsVoting = ProductVoteSearch;
      });

  }

  getAllVotingProducts() {
    this.server_sc.getAllVotingProducts().then((result: []) => {
      console.log('Vous avez récupéré tous les produits "NOUVEAUX" ou "EN MODIFICATION" : ', result);
      for (let i = 0; i < result.length; i++) {
        const uniqueSqlResult = result[i] as any;
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
        this.ProductsVoting.push(singleProduct);
        console.log(singleProduct);
      }
    });
  }
}

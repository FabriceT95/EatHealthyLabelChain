import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Product} from '../../shared/product.model';
import {Web3Service} from '../../util/web3.service';
import {ServerService} from '../../server.service';

@Component({
  selector: 'app-user-result-vote',
  templateUrl: './user-result-vote.component.html',
  styleUrls: ['./user-result-vote.component.css']
})
export class UserResultVoteComponent implements OnInit {
  ProductsVoting: Product[][] = [];

  constructor(private web3: Web3Service,
              private server: ServerService) {
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

  }

  async getAllVotingProducts() {
    await this.web3.contract.methods.getProductsVoting().call()
      .then( async (result) => {
        for (let i = 0; i < result[0].length; i++) {
          console.log( 'le type putain  : ' + typeof(result[0][i].productProposerAddress));
          if (result[0][i].productProposerAddress !== '0x0000000000000000000000000000000000000000') {
            const start_date = new Date(result[0][i].created_t * 1000).toString();
            const end_date = new Date(result[0][i].endDate * 1000).toString();
            console.log('Les produits en cours de vote : ' + result[0][i]);
            const singleProduct = new Product(
              result[0][i].productProposerAddress,
              result[0][i].productCode,
              result[0][i].productName,
              result[1][i],
              result[0][i].ingredients,
              result[0][i].quantity,
              result[0][i].typeOfProduct,
              result[0][i].packaging,
              result[0][i].labels,
              result[0][i].additifs,
              [start_date, end_date],
              result[0][i].forVotes,
              result[0][i].againstVotes,
              result[0][i].alreadyVoted,
              result[0][i].endDate,
              result[0][i].status
            );
            if (result[0][i].status === 2) {
              await this.web3.contract.methods.getProduct(result[0][i].productCode).call().then( async (result2) => {
                const beforeModificationProduct = new Product(
                  result2[0].productProposerAddress,
                  result2[0].productCode,
                  result2[0].productName,
                  result2[1],
                  result2[0].ingredients,
                  result2[0].quantity,
                  result2[0].typeOfProduct,
                  result2[0].packaging,
                  result2[0].labels,
                  result2[0].additifs,
                  [start_date, end_date],
                  result2[0].forVotes,
                  result2[0].againstVotes,
                  result2[0].alreadyVoted,
                  result2[0].endDate,
                  result2[0].status
                );
                this.ProductsVoting.push([singleProduct, beforeModificationProduct]);
              });
            } else {
              this.ProductsVoting.push([singleProduct, null]);
            }

          }
        }
      });
  }
}

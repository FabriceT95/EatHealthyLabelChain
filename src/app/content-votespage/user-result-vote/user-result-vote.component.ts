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
  ProductsVoting: Product[] = [];

  constructor(private web3: Web3Service,
              private server: ServerService) {
  }

  ngOnInit() {
    const that = this;
    setTimeout(async () => {
      await this.web3.contract.methods.getProductsVoting().call()
        .then((result) => {
          for (let i = 0; i < result[0].length; i++) {
            const start_date = new Date(result[0][i].created_n_last_modif[0]).toLocaleDateString('en-fr');
            const end_date = new Date(result[0][i].created_n_last_modif[1]).toLocaleDateString('en-fr');
            console.log(start_date);
            console.log(end_date);
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
              result[0][i].totalVotes,
              result[0][i].forVotes,
              result[0][i].againstVotes,
            );
            that.ProductsVoting.push(singleProduct);
          }
        });
    }, 100);

  }
}

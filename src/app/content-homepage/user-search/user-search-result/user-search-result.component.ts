import {Component, OnInit} from '@angular/core';
import {Product} from '../../../shared/product.model';
import {Web3Service} from '../../../util/web3.service';

@Component({
  selector: 'app-user-search-result',
  templateUrl: './user-search-result.component.html',
  styleUrls: ['./user-search-result.component.css']
})
export class UserSearchResultComponent implements OnInit {
  AcceptedProduct: Product[] = [];

  constructor(private web3: Web3Service) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.getProducts();
    }, 500);

  }

  async getProducts () {
    await this.web3.contract.methods.getProductsAccepted().call()
      .then((result) => {
        for (let i = 0; i < result[0].length; i++) {
          if (result[0][i].productProposerAddress !== '0x0000000000000000000000000000000000000000') {
            const start_date = new Date(result[0][i].created_n_last_modif[0] * 1000).toString();
            const end_date = new Date(result[0][i].endDate * 1000).toString();
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
              result[0][i].alreadyVoted,
            );
            this.AcceptedProduct.push(singleProduct);
          }
        }
      });
  }



}

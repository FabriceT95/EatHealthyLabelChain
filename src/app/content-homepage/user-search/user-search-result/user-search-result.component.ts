import {Component, OnInit} from '@angular/core';
import {Product} from '../../../shared/product.model';
import {Web3Service} from '../../../util/web3.service';

@Component({
  selector: 'app-user-search-result',
  templateUrl: './user-search-result.component.html',
  styleUrls: ['./user-search-result.component.css']
})
export class UserSearchResultComponent implements OnInit {
  AcceptedProduct: Product[][] = [];

  constructor(private web3: Web3Service) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.getProducts();
    }, 500);

  }

  async getProducts () {
    await this.web3.contract.methods.getProductsAccepted().call()
      .then(async (result) => {
        for (let i = 0; i < result[0].length; i++) {
          if (result[0][i].productProposerAddress !== '0x0000000000000000000000000000000000000000') {
            const start_date = new Date(result[0][i].created_t * 1000).toString();
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
              result[0][i].forVotes,
              result[0][i].againstVotes,
              result[0][i].alreadyVoted,
              result[0][i].endDate,
              result[0][i].status
            );
            console.log('Status modify depuis result : ' + result[0][i].status);

            if (parseInt(result[0][i].status, 10) === 3) {
              console.log('LALALALALALALALALALALALALA');
              await this.web3.contract.methods.getProduct(result[0][i].productCode).call().then( async (result2) => {
                const start_date_2 = new Date(result[0][i].created_t * 1000).toString();
                const end_date_2 = new Date(result[0][i].endDate * 1000).toString();
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
                  [start_date_2, end_date_2],
                  result2[0].forVotes,
                  result2[0].againstVotes,
                  result2[0].alreadyVoted,
                  result2[0].endDate,
                  result2[0].status
                );
                this.AcceptedProduct.push([singleProduct, beforeModificationProduct]);
              });
            } else {
              this.AcceptedProduct.push([singleProduct, null]);
            }
          }
        }
      });
  }



}

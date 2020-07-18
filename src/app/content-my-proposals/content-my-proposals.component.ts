import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../util/web3.service';
import {Product} from '../shared/product.model';

@Component({
  selector: 'app-content-my-proposals',
  templateUrl: './content-my-proposals.component.html',
  styleUrls: ['./content-my-proposals.component.css']
})
export class ContentMyProposalsComponent implements OnInit {
  UserProductsProposal: Product[] = [];

  constructor(private web3: Web3Service) {
  }

  ngOnInit() {
    this.getProductsProposedByUser();
    setInterval(() => {
      this.getProductsProposedByUser();
    }, 5000);
  }

  async getProductsProposedByUser() {
    this.UserProductsProposal = [];
    const that = this;
    await this.web3.contract.methods.getProductsVoting().call()
      .then((result) => {
        for (let i = 0; i < result[0].length; i++) {
          if (result[0][i].productProposerAddress === this.web3.accounts[0]) {
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
              {},
              result[0][i].endDate
            );
            that.UserProductsProposal.push(singleProduct);
          }
        }
      });
  }

}

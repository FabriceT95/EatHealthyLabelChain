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
    setTimeout(() => {
      this.getMyProposals();
    }, 500);
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
        const singleProduct = this.product.createProduct(uniqueSqlResult);
        this.UserProductsProposal.push(singleProduct);
      }
    });
  }

}

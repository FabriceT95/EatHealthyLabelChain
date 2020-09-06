import {Component, OnInit} from '@angular/core';
import {Product} from '../../../shared/product.model';
import {Web3Service} from '../../../util/web3.service';
import {ServerSCService} from '../../../server-sc.service';
import {ProductService} from '../../../product.service';


@Component({
  selector: 'app-user-search-result',
  templateUrl: './user-search-result.component.html',
  styleUrls: ['./user-search-result.component.css']
})
// Component used in Homepage : Search result component
// Contains search result items
export class UserSearchResultComponent implements OnInit {
  private AcceptedProduct: { [productCode: number]: [Product, Product[]?] } = {};
  private AcceptedProductArray: [Product, Product[]][] = [];
  private indexAcceptedProductArray = 0;

  constructor(private web3: Web3Service,
              private server_sc: ServerSCService,
              private product: ProductService) {
  }

  // On init, display all products with accepted status
  ngOnInit() {
    this.getAllAcceptedProducts();
    this.server_sc.changeDataSource.subscribe(() => {
      this.AcceptedProduct = {};
      this.AcceptedProductArray = [];
      this.indexAcceptedProductArray = 0;
      this.getAllAcceptedProducts();
    });
    this.server_sc.content_vote_page_change_accepted.subscribe(
      (ProductAcceptedSearch: [Product, Product[]][]) => {
        this.AcceptedProductArray = [];
        this.AcceptedProductArray = ProductAcceptedSearch;
      });

  }

  // Gets all accepted products from the DB and add them properly to the accepted product dictionary
  async getAllAcceptedProducts() {
    const that = this;
    this.server_sc.getAllAcceptedProducts().then((result: []) => {
      for (let i = 0; i < result.length; i++) {
        const uniqueSqlResult = result[i] as any;
        const singleProduct = this.product.createProduct(uniqueSqlResult);
        if (uniqueSqlResult.status === 'ACCEPTED') {
          that.AcceptedProduct[singleProduct.code] = [singleProduct, []];
        } else {
          that.AcceptedProduct[singleProduct.code][1].push(singleProduct);
        }

      }
      for (const key in that.AcceptedProduct) {
        if (that.AcceptedProduct[key][0] !== null) {
          that.AcceptedProductArray[that.indexAcceptedProductArray] = [that.AcceptedProduct[key][0], []];
          if (that.AcceptedProduct[key][1][0] !== null) {
            for (let i = 0; i < that.AcceptedProduct[key][1].length; i++) {
              that.AcceptedProductArray[that.indexAcceptedProductArray][1].push(that.AcceptedProduct[key][1][i]);
            }
          }
          that.indexAcceptedProductArray++;
        }
      }
    });
  }


}

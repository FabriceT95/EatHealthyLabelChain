import {Component, OnInit} from '@angular/core';
import {ServerSCService} from '../../../server-sc.service';
import {Subscription} from 'rxjs';
import {Product} from '../../../shared/product.model';
import {ProductService} from '../../../product.service';

@Component({
  selector: 'app-user-search-input',
  templateUrl: './user-search-input.component.html',
  styleUrls: ['./user-search-input.component.css']
})
// Component used in Homepage for managing input search
export class UserSearchInputComponent implements OnInit {
  alphabet_vote = false;
  date_vote = false;
  typeSelected = 'product_code';
  input = '';
  ProductsAccepted: { [productCode: number]: [Product?, Product[]?] } = {};
  AcceptedProductArray: [Product, Product[]][] = [];
  subscriptionDate: Subscription;
  subscriptionAlphabet: Subscription;
  subscriptionTypeSelected: Subscription;
  private indexAcceptedProductArray = 0;

  // ServerSCService to get database access, ProductService creating a product object

  // Set up event catchers (Date order, alphabetical order, input search type)
  constructor(private server_sc: ServerSCService, private product: ProductService) {
    this.subscriptionDate = this.server_sc.date_order_change_accepted
      .subscribe(date => {
        this.date_vote = date;
        this.searchAccepted(this.input);
        console.log('Date order : ' + this.date_vote);
      });
    this.subscriptionAlphabet = this.server_sc.alphabetical_order_change_accepted
      .subscribe(alphabet => {
        this.alphabet_vote = alphabet;
        this.searchAccepted(this.input);
        console.log('alphabet order : ' + this.alphabet_vote);
      });
    this.subscriptionTypeSelected = this.server_sc.typeSelected_change_accepted
      .subscribe(typeSelected => {
        this.typeSelected = typeSelected;
        console.log('type selected : ' + this.typeSelected);
        this.searchAccepted(this.input);
      });
  }

  ngOnInit() {
  }

  // returns only accepted product depending on the input typed in searchbar and by filters
  searchAccepted(input = '') {
    const that = this;
    this.ProductsAccepted = {};
    this.AcceptedProductArray = [];
    if (input === '') {
      this.input = '*';
    } else {
      this.input = input;
    }
    const getValues = {
      inputSearch: this.input,
      typeSelected: this.typeSelected,
      dateOrder: this.date_vote,
      alphabetOrder: this.alphabet_vote
    };
    this.server_sc.getAcceptedProducts(getValues).then((result: []) => {
      for (let i = 0; i < result.length; i++) {
        const uniqueSqlResult = result[i] as any;
        const singleProduct = this.product.createProduct(uniqueSqlResult);
        /* new Product(
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
        if (that.ProductsAccepted[singleProduct.code] === undefined) {
          that.ProductsAccepted[singleProduct.code] = [singleProduct, []];
        }
        if (uniqueSqlResult.status === 'ACCEPTED') {
          that.ProductsAccepted[singleProduct.code][0] = singleProduct;
        } else {
          that.ProductsAccepted[singleProduct.code][1].push(singleProduct);
        }
      }
      for (const key in that.ProductsAccepted) {
        if (that.ProductsAccepted[key][0] !== null) {
          that.AcceptedProductArray[that.indexAcceptedProductArray] = [that.ProductsAccepted[key][0], []];
          if (that.ProductsAccepted[key][1][0] !== null) {
            for (let i = 0; i < that.ProductsAccepted[key][1].length; i++) {
              that.AcceptedProductArray[that.indexAcceptedProductArray][1].push(that.ProductsAccepted[key][1][i]);
            }
          }
          that.indexAcceptedProductArray++;
        }
      }

      that.AcceptedProductArray = that.AcceptedProductArray.filter(function (el) {
        return el != null;
      });
      that.server_sc.content_vote_page_change_accepted.emit(this.AcceptedProductArray);
    });
  }


}

import {Component, EventEmitter, OnInit} from '@angular/core';
import {ServerSCService} from '../../../server-sc.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Product} from '../../../shared/product.model';
import {ProductService} from '../../../product.service';

@Component({
  selector: 'app-user-search-vote-input',
  templateUrl: './user-search-vote-input.component.html',
  styleUrls: ['./user-search-vote-input.component.css']
})
export class UserSearchVoteInputComponent implements OnInit {

  alphabet_vote = false;
  date_vote = false;
  typeSelected = 'productCode';
  input = '';
  ProductsVoting: Product[] = [];
  subscriptionDate: Subscription;
  subscriptionAlphabet: Subscription;
  subscriptionTypeSelected: Subscription;

  constructor(private server_sc: ServerSCService,
              private product: ProductService) {
    this.subscriptionDate = this.server_sc.date_order_change
      .subscribe(date => {
        this.date_vote = date;
        this.searchVotable(this.input);
        console.log('Date order : ' + this.date_vote);
      });
    this.subscriptionAlphabet = this.server_sc.alphabetical_order_change
      .subscribe(alphabet => {
        this.alphabet_vote = alphabet;
        this.searchVotable(this.input);
        console.log('alphabet order : ' + this.alphabet_vote);
      });
    this.subscriptionTypeSelected = this.server_sc.typeSelected_change
      .subscribe(typeSelected => {
        this.typeSelected = typeSelected;
        console.log('type selected : ' + this.typeSelected);
        this.searchVotable(this.input);
      });
  }

  ngOnInit() {
  }

  searchVotable(input = '') {
    this.ProductsVoting = [];
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
    this.server_sc.getVotingProducts(getValues).then((result: []) => {
      for (let i = 0; i < result.length; i++) {
        const uniqueSqlResult = result[i] as any;
        const singleProduct = this.product.createProduct(uniqueSqlResult);
        this.ProductsVoting.push(singleProduct);
      }
      console.log('Résultat à display :' + this.ProductsVoting);
      this.server_sc.content_vote_page_change.emit(this.ProductsVoting);
    });
  }
}

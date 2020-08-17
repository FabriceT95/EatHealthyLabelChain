import {Component, OnInit} from '@angular/core';
import {ServerSCService} from '../../../server-sc.service';

interface InputType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-user-search-filter',
  templateUrl: './user-search-filter.component.html',
  styleUrls: ['./user-search-filter.component.css']
})
export class UserSearchFilterComponent implements OnInit {
  categories: InputType[] = [
    {value: 'product_code', viewValue: 'Code du produit'},
    {value: 'label', viewValue: 'Labels'},
    {value: 'ingredients', viewValue: 'Ingredients'},
    {value: 'product_type', viewValue: 'Type de produit'},
    {value: 'product_name', viewValue: 'Nom de produit'}
  ];
  private currentDateOrder = false;
  private currentAlphabeticalOrder = false;
  private typeSelected = 'productCode';

  constructor(private server_sc: ServerSCService) {
  }

  ngOnInit() {
  }

  TriggerTypeSelected() {
     this.server_sc.typeSelected_change_accepted.emit(this.typeSelected);
  }

  TriggerDateOrder() {
     this.server_sc.date_order_change_accepted.emit(!this.currentDateOrder);
     this.currentDateOrder = !this.currentDateOrder;
  }

  TriggerAlphabeticalOrder() {
    this.server_sc.alphabetical_order_change_accepted.emit(!this.currentAlphabeticalOrder);
    this.currentAlphabeticalOrder = !this.currentAlphabeticalOrder;
  }
}

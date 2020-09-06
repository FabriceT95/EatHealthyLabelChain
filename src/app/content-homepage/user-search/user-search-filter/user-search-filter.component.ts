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
// Component used in Homepage for managing basic input filters
export class UserSearchFilterComponent implements OnInit {
  // Search type input
  categories: InputType[] = [
    {value: 'product_code', viewValue: 'Code du produit'},
    {value: 'label', viewValue: 'Labels'},
    {value: 'ingredients', viewValue: 'Ingredients'},
    {value: 'product_type', viewValue: 'Type de produit'},
    {value: 'product_name', viewValue: 'Nom de produit'}
  ];
  private currentDateOrder = false;
  private currentAlphabeticalOrder = false;
  // Default input type search
  private typeSelected = 'productCode';

  // ServerSCService to get database access
  constructor(private server_sc: ServerSCService) {
  }

  ngOnInit() {
  }

  // Emit events on input change
  TriggerTypeSelected() {
    this.server_sc.typeSelected_change_accepted.emit(this.typeSelected);
  }

  // Emit events on input change
  TriggerDateOrder() {
    this.server_sc.date_order_change_accepted.emit(!this.currentDateOrder);
    this.currentDateOrder = !this.currentDateOrder;
  }

  // Emit events on input change
  TriggerAlphabeticalOrder() {
    this.server_sc.alphabetical_order_change_accepted.emit(!this.currentAlphabeticalOrder);
    this.currentAlphabeticalOrder = !this.currentAlphabeticalOrder;
  }
}

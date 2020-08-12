import {Component, OnInit, AfterViewInit} from '@angular/core';
import {ServerSCService} from '../../../server-sc.service';

interface InputType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-user-search-vote-filter',
  templateUrl: './user-search-vote-filter.component.html',
  styleUrls: ['./user-search-vote-filter.component.css']
})
export class UserSearchVoteFilterComponent implements OnInit, AfterViewInit {

  categories: InputType[] = [
    {value: 'productCode', viewValue: 'Code du produit'},
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

  ngAfterViewInit(): void {

  }

  TriggerTypeSelected() {
    this.server_sc.typeSelected_change.emit(this.typeSelected);
  }

  TriggerDateOrder() {
    this.server_sc.date_order_change.emit(!this.currentDateOrder);
    this.currentDateOrder = !this.currentDateOrder;
  }

  TriggerAlphabeticalOrder() {
    this.server_sc.alphabetical_order_change.emit(!this.currentAlphabeticalOrder);
    this.currentAlphabeticalOrder = !this.currentAlphabeticalOrder;
  }

}

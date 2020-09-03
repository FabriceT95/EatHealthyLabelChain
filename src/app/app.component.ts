import {Component, Inject, OnInit} from '@angular/core';
import {Web3Service} from './util/web3.service';
import dataTest from './../../build/contracts/DataTest.json';
import {ServerService} from './server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {
  title = 'app works!';
  role: any;
  isChecked: boolean;
  loadedPage = 'accueil';

  /*constructor(public web3: WEB3) {
   }*/

  /*constructor(public web3: Web3Service) {
  }*/


  async ngOnInit() {

  }

  onNavigate(page: string) {
    this.loadedPage = page;
  }

  onDataSourceChanged(boolSourceData) {
    this.isChecked = boolSourceData;
    console.log('isChecked from app.component.ts : ', this.isChecked);
  }

}

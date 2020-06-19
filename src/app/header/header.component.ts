import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private web3: AppComponent) {
  }

  async ngOnInit() {

    setTimeout(() => {
      console.log(this.web3);
    }, 1000);

  }
}

import {Component, OnInit, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppComponent} from '../app.component';
import dataTest from '../../../build/contracts/DataTest.json';
import {WEB3} from '../util/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() changeDataSource = new EventEmitter<boolean>();
  @Output() pageSelected = new EventEmitter<string>();

  constructor() {
  }

  async ngOnInit() {
    /*
        setTimeout(() => {
          console.log(this.web3);
        }, 1000);
    */
  }

  onSelect(page: string) {
    this.pageSelected.emit(page);
  }

  onChangeDataSource(SourceData) {
    this.changeDataSource.emit(SourceData._checked);
  }
}

import {Component, OnInit, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() changeDataSource = new EventEmitter<boolean>();
  @Output() pageSelected = new EventEmitter<string>();
  constructor(private web3: AppComponent) {
  }

  ngOnInit() {
/*
    setTimeout(() => {
      console.log(this.web3);
    }, 1000);
*/
  }

  onSelect(page: string){
    this.pageSelected.emit(page);
  }

  onChangeDataSource(SourceData) {
    this.changeDataSource.emit(SourceData._checked);
  }
}

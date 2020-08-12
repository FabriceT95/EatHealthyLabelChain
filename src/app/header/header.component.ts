import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {AppComponent} from '../app.component';
import dataTest from '../../../build/contracts/DataTest.json';
import {WEB3, Web3Service} from '../util/web3.service';
import {ServerService} from '../server.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() changeDataSource = new EventEmitter<boolean>();

  constructor(private web3: Web3Service, private server: ServerService) {
  }

  async ngOnInit() {
    /*
        setTimeout(() => {
          console.log(this.web3);
        }, 1000);
    */
  }


  onChangeDataSource(SourceData) {
    //  this.changeDataSource.emit(SourceData._checked);
    console.log('Source data : ' + SourceData._checked);
    this.web3.isChecked = !SourceData._checked;
    this.server.isChecked = SourceData._checked;
    console.log('web3 : ' + this.web3.isChecked);
    console.log('server mysql : ' + this.server.isChecked);
  }
}

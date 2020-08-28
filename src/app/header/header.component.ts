import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {AppComponent} from '../app.component';
import dataTest from '../../../build/contracts/DataTest.json';
import {WEB3, Web3Service} from '../util/web3.service';
import {ServerService} from '../server.service';
import {ServerSCService} from '../server-sc.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() changeDataSource = new EventEmitter<boolean>();

  constructor(private web3: Web3Service, private server: ServerService, private server_sc: ServerSCService) {
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
    this.server_sc.isChecked = !SourceData._checked;
    this.server.isChecked = SourceData._checked;
    console.log('web3 : ' + this.server_sc.isChecked);
    console.log('server mysql : ' + this.server.isChecked);
  }
}

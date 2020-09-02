import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {AppComponent} from '../app.component';
import dataTest from '../../../build/contracts/DataTest.json';
import {WEB3, Web3Service} from '../util/web3.service';
import {ServerService} from '../server.service';
import {ServerSCService} from '../server-sc.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // @Output() changeDataSource = new EventEmitter();

  constructor(private web3: Web3Service, private server: ServerService, private server_sc: ServerSCService) {
  }

  async ngOnInit() {
  }


  onChangeDataSource(SourceData) {
    console.log('Source data : ' + SourceData._checked);
    this.server_sc.isChecked = !SourceData._checked;
    this.server.isChecked = SourceData._checked;
    this.server_sc.serverUrl = environment.serverIP + ':' + (this.server_sc.isChecked ? this.server_sc.port_SC : this.server_sc.port);
    this.server_sc.changeDataSource.emit();
  }
}

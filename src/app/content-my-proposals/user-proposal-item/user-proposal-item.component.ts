import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../shared/product.model';
import {Web3Service} from '../../util/web3.service';

@Component({
  selector: 'app-user-proposal-item',
  templateUrl: './user-proposal-item.component.html',
  styleUrls: ['./user-proposal-item.component.css']
})
export class UserProposalItemComponent implements OnInit {
  @Input() product: Product;
  @Input() productIndex: number;
  timeLeft: string;
  getTimeLeftInterval;

  constructor(private web3: Web3Service) {
  }

  async ngOnInit() {
    this.getTimeLeft();
    this.getTimeLeftInterval = setInterval(() => {
      this.getTimeLeft();
    }, 60000);
  }
  async getTimeLeft() {
    this.timeLeft = this.dhm(new Date(this.product.endDate).getTime() - Date.now());
    if (this.product.endDate * 1000 - Date.now() < 0) {
      this.timeLeft = 'Fin du vote en cours...';
    }
  }

  dhm(t) {
    const cd = 24 * 60 * 60 * 1000;
    const ch = 60 * 60 * 1000;
    let d = Math.floor(t / cd);
    let h = Math.floor((t - d * cd) / ch);
    let m = Math.round((t - d * cd - h * ch) / 60000);
    const pad = function (n) {
      return n < 10 ? '0' + n : n;
    };
    if (m === 60) {
      h++;
      m = 0;
    }
    if (h === 24) {
      d++;
      h = 0;
    }
    return d + ' jour(s) ' + pad(h) + ':' + pad(m);
  }

}

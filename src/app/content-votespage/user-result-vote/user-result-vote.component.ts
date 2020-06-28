import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {UserFormVoteComponent} from './user-form-vote/user-form-vote.component';

@Component({
  selector: 'app-user-result-vote',
  templateUrl: './user-result-vote.component.html',
  styleUrls: ['./user-result-vote.component.css']
})
export class UserResultVoteComponent implements OnInit {


  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UserFormVoteComponent, {
      width: '50%',
     // height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

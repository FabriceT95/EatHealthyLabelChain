import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatSlideToggleModule
} from '@angular/material';
import {FormInputProductComponent} from './content-homepage/user-product-manager/form-input-product/form-input-product.component';
import {HeaderComponent} from './header/header.component';
import {ServerService} from './server.service';
import {ContentHomepageComponent} from './content-homepage/content-homepage.component';
import {UserProfileComponent} from './content-homepage/user-profile/user-profile.component';
import {UserProductManagerComponent} from './content-homepage/user-product-manager/user-product-manager.component';
import {UserSearchComponent} from './content-homepage/user-search/user-search.component';
import {MatDividerModule} from '@angular/material/divider';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';
import {UserSearchFilterComponent} from './content-homepage/user-search/user-search-filter/user-search-filter.component';
import {UserSearchInputComponent} from './content-homepage/user-search/user-search-input/user-search-input.component';
import {UserSearchResultComponent} from './content-homepage/user-search/user-search-result/user-search-result.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ContentVotespageComponent} from './content-votespage/content-votespage.component';
import {UserDataVotesComponent} from './content-votespage/user-data-votes/user-data-votes.component';
import {UserHistoryComponent} from './content-votespage/user-history/user-history.component';
import {UserSearchVoteComponent} from './content-votespage/user-search-vote/user-search-vote.component';
import {UserResultVoteComponent} from './content-votespage/user-result-vote/user-result-vote.component';
import {UserFormVoteComponent} from './content-votespage/user-result-vote/user-form-vote/user-form-vote.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {Web3Service} from './util/web3.service';

@NgModule({
  declarations: [
    AppComponent,
    FormInputProductComponent,
    HeaderComponent,
    ContentHomepageComponent,
    UserProfileComponent,
    UserProductManagerComponent,
    UserSearchComponent,
    UserSearchFilterComponent,
    UserSearchInputComponent,
    UserSearchResultComponent,
    ContentVotespageComponent,
    UserDataVotesComponent,
    UserHistoryComponent,
    UserSearchVoteComponent,
    UserResultVoteComponent,
    UserFormVoteComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSlideToggleModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatDividerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatGridListModule
  ],
  providers: [Web3Service, ServerService, AppComponent],
  bootstrap: [AppComponent],
  entryComponents: [
    UserFormVoteComponent,
    FormInputProductComponent,
  ]
})
export class AppModule {
}

import { NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContentHomepageComponent} from './content-homepage/content-homepage.component';
import {ContentVotespageComponent} from './content-votespage/content-votespage.component';
import {ContentMyProposalsComponent} from './content-my-proposals/content-my-proposals.component';

const appRoutes: Routes = [
  { path : '', redirectTo : '/homepage', pathMatch: 'full'},
  { path : 'homepage', component : ContentHomepageComponent},
  { path : 'votepage', component : ContentVotespageComponent},
  { path : 'myProposals', component : ContentMyProposalsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatSlideToggleModule
} from '@angular/material';
import { FormInputProductComponent } from './form-input-product/form-input-product.component';
import { HeaderComponent } from './header/header.component';
import {ServerService} from './server.service';
import { ContentHomepageComponent } from './content-homepage/content-homepage.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProductManagerComponent } from './user-product-manager/user-product-manager.component';
import { UserSearchComponent } from './user-search/user-search.component';
import {MatDividerModule} from '@angular/material/divider';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    FormInputProductComponent,
    HeaderComponent,
    ContentHomepageComponent,
    UserProfileComponent,
    UserProductManagerComponent,
    UserSearchComponent
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
    MatDialogModule
  ],
  providers: [AppComponent, ServerService],
  bootstrap: [AppComponent],
  entryComponents: [
    FormInputProductComponent
  ]
})
export class AppModule { }

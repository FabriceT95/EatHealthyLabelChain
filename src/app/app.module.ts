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

@NgModule({
  declarations: [
    AppComponent,
    FormInputProductComponent,
    HeaderComponent
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
  ],
  providers: [ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }

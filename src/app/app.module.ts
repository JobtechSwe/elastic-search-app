import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatToolbarModule, MatListModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AdsComponent } from './ads/ads.component';

@NgModule({
  declarations: [
    AppComponent,
    AdsComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    MatToolbarModule, MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

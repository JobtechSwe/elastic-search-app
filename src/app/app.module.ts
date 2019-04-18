import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatToolbarModule, MatListModule, MatAutocompleteModule, MatProgressSpinnerModule, MatExpansionModule, MatChipsModule, MatCardModule, MatBadgeModule, MatIconModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppComponent } from './app.component';
import { AdsComponent } from './ads/ads.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { CriteriaBoxComponent } from './criteria-box/criteria-box.component';

@NgModule({
  declarations: [
    AppComponent,
    AdsComponent,
    SearchBoxComponent,
    CriteriaBoxComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, ReactiveFormsModule,
    MatButtonModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
    MatToolbarModule, MatListModule, MatAutocompleteModule, MatExpansionModule,
    FlexLayoutModule, MatChipsModule, MatCardModule, MatBadgeModule, MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

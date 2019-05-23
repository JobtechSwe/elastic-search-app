import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatToolbarModule, MatListModule, MatAutocompleteModule, MatProgressSpinnerModule, MatExpansionModule, MatChipsModule, MatCardModule, MatBadgeModule, MatIconModule, MatDialogModule, MatSelectModule, MatSidenavModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AdsComponent } from './ads/ads.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { CriteriaBoxComponent } from './criteria-box/criteria-box.component';
import { SimpleSearchComponent } from './simple-search/simple-search.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchStatsComponent } from './search-stats/search-stats.component';
import { SettingsComponent } from './settings/settings.component';

const appRoutes: Routes = [
  { path: '', component: AdsComponent },
  { path: 'simplesearch', component: SimpleSearchComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    AdsComponent,
    SearchBoxComponent,
    CriteriaBoxComponent,
    SimpleSearchComponent,
    SearchResultComponent,
    SearchStatsComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, ReactiveFormsModule,
    MatButtonModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
    MatToolbarModule, MatListModule, MatAutocompleteModule, MatExpansionModule,
    FlexLayoutModule, MatChipsModule, MatCardModule, MatBadgeModule, MatIconModule,
    MatDialogModule, MatSelectModule, MatSidenavModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  entryComponents: [
    SettingsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

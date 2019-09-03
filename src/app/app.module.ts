import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatToolbarModule, MatListModule, MatAutocompleteModule, MatProgressSpinnerModule, MatExpansionModule, MatChipsModule, MatCardModule, MatBadgeModule, MatIconModule, MatDialogModule, MatSelectModule, MatSidenavModule, MatTooltipModule, MatSliderModule, MatGridListModule } from '@angular/material';
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
import { FreeTextConceptsComponent } from './free-text-concepts/free-text-concepts.component';
import { SearchOptionsComponent } from './search-options/search-options.component';
import { SearchResultItemComponent } from './search-result-item/search-result-item.component';
import { IFAUExplorerComponent } from './ifauexplorer/ifauexplorer.component';
import { AdListItemComponent } from './ad-list-item/ad-list-item.component';

const appRoutes: Routes = [
  { path: '', component: AdsComponent },
  { path: 'simplesearch', component: SimpleSearchComponent },
  { path: 'ifauexplorer', component: IFAUExplorerComponent},
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
    SettingsComponent,
    FreeTextConceptsComponent,
    SearchOptionsComponent,
    SearchResultItemComponent,
    IFAUExplorerComponent,
    AdListItemComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, ReactiveFormsModule, FormsModule,
    MatButtonModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
    MatToolbarModule, MatListModule, MatAutocompleteModule, MatExpansionModule,
    FlexLayoutModule, MatChipsModule, MatCardModule, MatBadgeModule, MatIconModule,
    MatDialogModule, MatSelectModule, MatSidenavModule, MatTooltipModule, MatSliderModule,
    MatGridListModule,
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

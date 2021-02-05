import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { filter, flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { AdService, CompleteResponse, CompleteValue } from '../ad.service';
import { AdsearchService, SearchResultViewModel } from '../adsearch.service';

@Component({
  selector: 'app-did-you-mean',
  templateUrl: './did-you-mean.component.html',
  styleUrls: ['./did-you-mean.component.css']
})
export class DidYouMeanComponent implements OnInit {

  @Input() searchResult$: Observable<SearchResultViewModel>

  suggestions: Array<SearchFieldSuggestions> = []
  
  constructor(private adSrv: AdService, private searchSrv: AdsearchService) {
    this.suggestions = []
   }

  ngOnInit() {
    this.searchResult$
    .pipe(
      tap(result => {
        this.suggestions = []
      }),
      filter(result => {
        return !this.searchSrv.currentSearch.term == false
      }),
      flatMap(result => {
        return this.adSrv.didYouMean(this.searchSrv.currentSearch)
      }),
      map(rawSuggestions => {
        return rawSuggestions.typeahead.map(s => {
          return new SearchFieldSuggestions(s.value, s.occurrences, false)
        })
      }),
      mergeMap(searchFiledSuggestions => {
        const requestUserWithCatArray = searchFiledSuggestions.map(suggestion => {
          const request = JSON.parse(JSON.stringify(this.searchSrv.currentSearch))
          request.term = suggestion.label
          return this.adSrv.getAdCount(request).pipe(
            map(adCount => {
              suggestion.adCount = adCount
              suggestion.shouldShow = adCount > 0
              return suggestion
            })
          )
        })
        return combineLatest(requestUserWithCatArray);
      }),
      tap(suggestions => {
        this.suggestions = suggestions
      })
    ).subscribe()
  }
}

export class SearchFieldSuggestions {
  label: string
  adCount: number
  shouldShow: boolean

  constructor(label: string, adCount: number, shouldShow: boolean) {
    this.label = label
    this.adCount = adCount
    this.shouldShow = shouldShow
  }

}
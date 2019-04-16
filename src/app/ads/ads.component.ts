import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdService, SearchAdResponse, SearchAdRequest } from '../ad.service';
import { Observable, Subject, of, NEVER } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap, map, tap, catchError
} from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  searchBoxControl = new FormControl();
  loading: boolean = false;
  searchError: boolean = false;
  searchURL: string;
  searchResult$: Observable<SearchAdResponse>;
  autocompleteOptions: Observable<string[]>;
  private searchTerms = new Subject<string>();

  @ViewChild('searchBox', { read: MatAutocompleteTrigger }) autoComplete: MatAutocompleteTrigger;

  constructor(private adService: AdService) {}

  search(): void {
    this.searchTerms.next(this.searchBoxControl.value);
    this.autoComplete.closePanel()
  }

  selectOption(option: string) {
    this.search()
  }

  ngOnInit(): void {
    this.searchURL = this.adService.adsUrl
    this.searchResult$ = this.searchTerms.pipe(
      tap(() => { this.loading = true, this.searchError = false } ),
      switchMap((term: string) => {
        var searchRequest = new SearchAdRequest()
        searchRequest.term = term
        searchRequest.stats = ['occupation', 'group', 'field']
        return this.adService.getAds(searchRequest).pipe(
          catchError( err => {
            this.searchError = true
            return NEVER 
          }),
        )
      }),
      tap( () => this.loading = false )
    );

    this.autocompleteOptions = this.searchBoxControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap( value => console.log('value = ' + value)),
        switchMap(value => { 
          return this.adService.complete(value).pipe(
            catchError( err => NEVER),
          )
        }),
        map(res => {
          if (res.typeahead === undefined) {
            return new Array<string>()
          }
          return res.typeahead.map(option => {
            var searchArray = this.searchBoxControl.value.split(' ')
            let lastString = searchArray.pop()
            searchArray.push(option)
            return searchArray.join(' ')
          })
        })
      );
  }

}

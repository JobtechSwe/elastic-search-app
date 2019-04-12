import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdService, CompleteResponse, SearchAdResponse } from '../ad.service';
import { Observable, Subject, of, NEVER } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap, map, tap, catchError
} from 'rxjs/operators';
import { stringify } from '@angular/core/src/util';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  myControl = new FormControl();
  loading: boolean = false;
  searchError: boolean = false;
  searchResult$: Observable<SearchAdResponse>;
  autocompleteOptions: Observable<string[]>;
  private searchTerms = new Subject<string>();

  constructor(private adService: AdService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    
    this.searchResult$ = this.searchTerms.pipe(
      tap(() => { this.loading = true, this.searchError = false } ),
      switchMap((term: string) => { 
        return this.adService.getAds(term).pipe(
          catchError( err => {
            this.searchError = true
            return NEVER 
          }),
        )
      }),
      tap( () => this.loading = false )
    );

    this.autocompleteOptions = this.myControl.valueChanges
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
          return res.typeahead
        })
      );
  }

}

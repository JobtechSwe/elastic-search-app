import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdService, CompleteResponse } from '../ad.service';
import { Ad } from '../ad'
import { Observable, Subject, of } from 'rxjs';
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
  searchAds: Observable<[Ad]>;
  totalNumberOfAds: Observable<number>;
  autocompleteOptions: Observable<string[]>;
  private searchTerms = new Subject<string>();

  constructor(private adService: AdService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    
    const result = this.searchTerms.pipe(
      tap(() => this.loading = true),
      switchMap((term: string) => this.adService.getAds(term)),
      tap( () => this.loading = false )
    );
    this.searchAds = result.pipe(
      map(res => res.hits)
    )
    this.totalNumberOfAds = result.pipe(
      map(res => res.total)
    )

    this.autocompleteOptions = this.myControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap( value => console.log('value = ' + value)),
        switchMap(value => { 
          return this.adService.complete(value).pipe(
            catchError( err => {
              var emptyResponse = new CompleteResponse()
              emptyResponse.typeahead = ['']
              return of(emptyResponse)
            }),
          )
        }),
        map(res => {
          if (res.typeahead === undefined) {
            return new Array<string>()
          }
          return res.typeahead.map( option => {
            const typeText: string = this.myControl.value
            const lastSpace = typeText.lastIndexOf(' ')
            if (lastSpace != -1) {
              const startText = typeText.slice(0, lastSpace)
              return startText + ' ' + option
            } else {
              return option
            }
          })
        })
      );
  }

}

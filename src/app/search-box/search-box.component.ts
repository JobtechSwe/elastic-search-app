import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NEVER, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { AdService } from '../ad.service';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  @Output()
  onSearch = new EventEmitter()

  searchBoxControl = new FormControl()
  autocompleteOptions: Observable<string[]>
  
  @ViewChild('searchBox', { read: MatAutocompleteTrigger }) autoComplete: MatAutocompleteTrigger;
  
  constructor(private adService: AdService) { }

  ngOnInit() {
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
    )

  }

  search() {
    this.autoComplete.closePanel()
    this.onSearch.next(this.searchBoxControl.value)
  }

  selectAutocomplete(option: string) {
    this.search()
  }

}

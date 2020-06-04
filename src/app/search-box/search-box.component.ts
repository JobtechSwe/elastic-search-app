import { Component, OnInit, ViewChild, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NEVER, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map, startWith } from 'rxjs/operators';
import { AdService, SearchAdRequest } from '../ad.service';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  @Input()
  currentSearch: SearchAdRequest

  @Output()
  onSearch = new EventEmitter()

  @Output()
  onChange = new EventEmitter()

  searchBoxControl = new FormControl()
  autocompleteOptions: Observable<AutocompleteValueViewModel[]>

  @ViewChild('searchBox', { read: MatAutocompleteTrigger, static: false }) autoComplete: MatAutocompleteTrigger;
  @ViewChild('searchBox', { read: ElementRef, static: false}) searchBox: ElementRef;

  constructor(private adService: AdService) { }

  ngOnInit() {
    let valueChangeSubject = this.searchBoxControl.valueChanges

    valueChangeSubject.subscribe(value => {
      this.onChange.next(value)
    })

    this.autocompleteOptions = valueChangeSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith(['']),
        switchMap(value => {
          return this.adService.complete(value, this.currentSearch).pipe(
            catchError(err => NEVER),
          )
        }),
        map(res => {
          if (res.typeahead === undefined) {
            return new Array<AutocompleteValueViewModel>()
          }
          return res.typeahead.map(option => {
            var viewModel = new AutocompleteValueViewModel()
            viewModel.text = option.value
            return viewModel
          })
        })
      )

  }

  search() {
    this.searchBox.nativeElement.blur()
    this.autoComplete.closePanel()
    this.onSearch.next()
  }

  selectAutocomplete(option: string) {
    this.search()
  }

}

export class AutocompleteValueViewModel {
  text: string
}
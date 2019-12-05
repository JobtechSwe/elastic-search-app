import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, NEVER } from 'rxjs';
import { AutocompleteValueViewModel } from '../search-box/search-box.component';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map, tap } from 'rxjs/operators';
import { AutocompleteService } from '../autocomplete.service';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-search-box-prototype',
  templateUrl: './search-box-prototype.component.html',
  styleUrls: ['./search-box-prototype.component.css']
})
export class SearchBoxPrototypeComponent implements OnInit {

  searchBoxControl = new FormControl()
  autocompleteOptions: Observable<AutocompleteValueViewModel[]>
  
  @ViewChild('searchBox', { read: MatAutocompleteTrigger }) autoComplete: MatAutocompleteTrigger;
  
  constructor(private autocompleteService: AutocompleteService) { }

  ngOnInit() {
    this.autocompleteOptions = this.searchBoxControl.valueChanges
    .pipe(
      tap(value => console.log('q = ' + value)),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        return this.autocompleteService.complete(value).pipe(
          catchError(err => NEVER),
        )
      }),
      map(res => {
        if (res.typeahead === undefined) {
          return new Array<AutocompleteValueViewModel>()
        }
        return res.typeahead
        .map(option => {
          var viewModel = new AutocompleteValueViewModel()
          viewModel.text = option.value
          console.log(viewModel)
          return viewModel
        })
      })
    )

}

}

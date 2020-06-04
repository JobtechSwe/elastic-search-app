import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { MatChipInputEvent, MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';
import { SearchCriteria } from '../model/search-criteria';
import { Observable, NEVER } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError, tap } from 'rxjs/operators';
import { AdService } from '../ad.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-criteria-box',
  templateUrl: './criteria-box.component.html',
  styleUrls: ['./criteria-box.component.css']
})
export class CriteriaBoxComponent implements OnInit {

  @Output() onChange = new EventEmitter()
  
  @Input() selectedCriterias: SearchCriteria[] = []

  criteriaOptions: Observable<SearchCriteria[]>
  criteriaCtrl = new FormControl()

  @ViewChild('criteriaInput', { read: MatAutocompleteTrigger, static: false }) criteriaInput: ElementRef<HTMLInputElement>
  @ViewChild('auto', { read: MatAutocomplete, static: false}) matAutocomplete: MatAutocomplete

  separatorKeysCodes: number[] = [ENTER, COMMA]

  constructor(private adService: AdService) { }

  ngOnInit() {

    this.criteriaOptions = this.criteriaCtrl.valueChanges
      .pipe(
        tap(value => console.log('criteriaValue = ' + value.term)),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          return this.adService.criteriaSearch(value).pipe(
            catchError(err => NEVER),
          )
        }),
        map(response => {
          return response.result.map(vfCriteria => {
            let criteria = new SearchCriteria()
            criteria.type = vfCriteria.type
            criteria.code = vfCriteria.id
            criteria.term = vfCriteria.term
            return criteria
          })
        })
      )

  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input
      // Reset the input value
      if (input) {
        input.value = ''
      }
    }
  }

  remove(criteria: SearchCriteria): void { 
    const index = this.selectedCriterias.indexOf(criteria);

    if (index >= 0) {
      this.selectedCriterias.splice(index, 1)
      this.onChange.next(this.selectedCriterias)
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let criteria = event.option.value as SearchCriteria
    this.selectedCriterias.push(criteria)
    this.onChange.next(this.selectedCriterias)
  }
}

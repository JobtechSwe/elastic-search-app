import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdService, SearchCriteria, SearchAdRequest, SearchStats } from '../ad.service';
import { Observable, Subject, combineLatest, NEVER } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap, map, tap, catchError
} from 'rxjs/operators';
import { MatAutocompleteTrigger, MatListOption, MatAccordion } from '@angular/material';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  searchBoxControl = new FormControl()
  loading: boolean = false
  searchError: boolean = false
  searchURL: string
  searchResult$: Observable<SearchResultViewModel>
  searchCriteria = new Subject<Array<SearchCriteria>>()
  autocompleteOptions: Observable<string[]>
  private searchTerms = new Subject<string>()

  @ViewChild('searchBox', { read: MatAutocompleteTrigger }) autoComplete: MatAutocompleteTrigger;

  constructor(private adService: AdService) {}

  search(): void {
    this.searchCriteria.next([])
    this.searchTerms.next(this.searchBoxControl.value)
    this.autoComplete.closePanel()
  }

  selectOption(option: string) {
    this.search()
  }

  selectStats(selectedStats: Array<MatListOption>) {
    let viewModels = selectedStats.map(stat => stat.value as StatsValueViewModel)
    let criterias = viewModels.map(viewModel => {
      let criteria = new SearchCriteria()
      criteria.code = viewModel.code
      criteria.type = viewModel.type
      criteria.term = viewModel.term
      return criteria
    })
    this.searchCriteria.next(criterias)
  }

  ngOnInit(): void {
    this.searchURL = this.adService.adsUrl
    let searchRequest = combineLatest(this.searchCriteria, this.searchTerms).pipe(
      map(([criterias, term]) => {
        let searchRequest = new SearchAdRequest()
        searchRequest.term = term
        searchRequest.stats = ['occupation', 'group', 'field']
        searchRequest.criterias = criterias
        return searchRequest
      }),
    )
    this.searchResult$ = searchRequest.pipe(
      tap(() => { this.loading = true, this.searchError = false } ),
      switchMap(request => {
        return this.adService.getAds(request).pipe(
          catchError( err => {
            this.searchError = true
            return NEVER 
          }),
        )
      }),
      map(response => {
        let viewModel = new SearchResultViewModel()
        viewModel.total = response.total
        viewModel.hits = response.hits.map(ad => {
          let viewModel = new AdViewModel()
          viewModel.headline = ad.headline
          viewModel.id = ad.id
          return viewModel
        })
        let groupStat = response.stats.find(stat => stat.type === 'group')
        if (groupStat != undefined) {
          viewModel.statsGroup = statsValueViewModel(groupStat)
        }
        let fieldStat = response.stats.find(stat => stat.type === 'field')
        if (fieldStat != undefined) {
          viewModel.statsField = statsValueViewModel(fieldStat)
        }
        let occupationStat = response.stats.find(stat => stat.type === 'occupation')
        if (occupationStat != undefined) {
          viewModel.statsOccupation = statsValueViewModel(occupationStat)
        }
        return viewModel
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

function statsValueViewModel(searchStats: SearchStats): Array<StatsValueViewModel> {
  let statsGroup = searchStats.values.map(value => {
    let viewModel = new StatsValueViewModel()
    viewModel.type = searchStats.type
    viewModel.code = value.code
    viewModel.count = value.count
    viewModel.term = value.term
    return viewModel
  })
  return statsGroup
}

export class SearchResultViewModel {
  total: number
  hits: Array<AdViewModel>
  statsOccupation: Array<StatsValueViewModel>
  statsField: Array<StatsValueViewModel>
  statsGroup: Array<StatsValueViewModel>
}

export class AdViewModel {
  id: number
  headline: string
}

export class StatsValueViewModel {
  type: string
  code: string
  count: number
  term: string
}
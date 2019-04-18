import { Component, OnInit } from '@angular/core';
import { AdService, SearchAdRequest, SearchStats } from '../ad.service';
import { Observable, Subject, combineLatest, NEVER } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { MatListOption } from '@angular/material';
import { Search } from '../model/search';
import { SearchCriteria } from '../model/search-criteria';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  loading: boolean = false
  searchError: boolean = false
  searchURL: string
  searchResult$: Observable<SearchResultViewModel>
  searchRequest = new Subject<SearchAdRequest>()
  
  private currentSearch = new Search()

  constructor(private adService: AdService) {}

  search(): void {
    let request = new SearchAdRequest()
    request.term = this.currentSearch.query
    request.stats = ['occupation', 'group', 'field']
    request.criterias = this.currentSearch.criterias
    this.searchRequest.next(request)
  }

  updateTerm(term: string) {
    this.currentSearch.query = term
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
    this.currentSearch.criterias = criterias
    this.search()
  }

  ngOnInit(): void {
    this.searchURL = this.adService.adsUrl
    this.searchResult$ = this.searchRequest.pipe(
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
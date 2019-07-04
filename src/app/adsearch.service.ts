import { Injectable } from '@angular/core';
import { AdService, SearchAdRequest, SearchStats, SearchAdResponse, FreeTextConcepts } from './ad.service';
import { Observable, Subject, NEVER } from 'rxjs';
import { SearchCriteria } from './model/search-criteria';
import { MatListOption } from '@angular/material';
import { tap, switchMap, catchError, map } from 'rxjs/operators';
import { ReqValue } from './model/ad';

@Injectable({
  providedIn: 'root'
})
export class AdsearchService {

  loading: boolean = false
  searchError: boolean = false
  searchResult$: Observable<SearchResultViewModel>
  currentSearch = new SearchAdRequest()

  private searchRequest = new Subject<SearchAdRequest>()

  constructor(private adService: AdService) {
    this.clearSearch()
    this.searchResult$ = this.searchRequest.pipe(
      tap(() => { this.loading = true, this.searchError = false }),
      switchMap(request => {
        return this.adService.getAds(request).pipe(
          catchError(err => {
            this.searchError = true
            return NEVER
          }),
        )
      }),
      map(response => {
        let viewModel = new SearchResultViewModel()
        viewModel.total = response.total
        if (response.hits) {
          viewModel.hits = response.hits.map(ad => {
            let viewModel = new AdViewModel()
            viewModel.relevance = ad.relevance
            viewModel.headline = ad.headline
            viewModel.id = ad.id
            viewModel.text = ad.description.text.substring(0, 200) + "..."
            viewModel.occupationName = ad.occupation.label
            viewModel.occupationField = ad.occupation_field.label
            viewModel.occupationGroup = ad.occupation_group.label
            viewModel.must_have = ad.must_have
            viewModel.nice_to_have = ad.nice_to_have
            viewModel.employer = ad.employer
            viewModel.workplace_address = ad.workplace_address
            return viewModel
          })
        }
        if (response.stats) {
          let groupStat = response.stats.find(stat => stat.type === 'occupation-group')
          if (groupStat != undefined) {
            viewModel.statsGroup = statsValueViewModel(groupStat)
          }
          let fieldStat = response.stats.find(stat => stat.type === 'occupation-field')
          if (fieldStat != undefined) {
            viewModel.statsField = statsValueViewModel(fieldStat)
          }
          let occupationStat = response.stats.find(stat => stat.type === 'occupation-name')
          if (occupationStat != undefined) {
            viewModel.statsOccupation = statsValueViewModel(occupationStat)
          }
        }
        viewModel.freeTextConcepts = response.freetext_concepts
        return viewModel
      }),
      tap(() => this.loading = false)
    )
  }

  search(): void {
    this.searchRequest.next(this.currentSearch)
  }

  updateTerm(term: string) {
    this.currentSearch.term = term
  }

  updateCriterias(criterias: Array<SearchCriteria>) {
    this.currentSearch.criterias = criterias
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
    this.currentSearch.criterias = this.currentSearch.criterias.concat(criterias)
    this.search()
  }

  clearSearch() {
    this.currentSearch = new SearchAdRequest()
    this.currentSearch.stats = ['occupation-name', 'occupation-group', 'occupation-field']
    this.currentSearch.criterias = []
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
  freeTextConcepts: FreeTextConcepts
}

export class AdViewModel {
  relevance: number
  id: number
  headline: string
  text: string
  occupationName: string
  occupationField: string
  occupationGroup: string
  must_have: {
    skills: [ReqValue],
    languages: [ReqValue],
    work_experiences: [ReqValue]
  }
  nice_to_have: {
    skills: [ReqValue],
    languages: [ReqValue],
    work_experiences: [ReqValue]
  }
  employer: {
    name: string
    workplace: string
  }
  workplace_address: {
    country: string
    municipality: string
    region: string
    city: string
  }
}

export class StatsValueViewModel {
  type: string
  code: string
  count: number
  term: string
}

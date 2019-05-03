import { Injectable } from '@angular/core';
import { Ad } from './model/ad';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, NEVER } from 'rxjs';
import { SearchCriteria } from './model/search-criteria';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient) { }

  private developUrl = 'https://develop-sokannonser.dev.services.jtech.se';
  private productionUrl = 'https://open-api.dev.services.jtech.se';
  adsUrl = this.productionUrl

  getAds(request: SearchAdRequest): Observable<SearchAdResponse> {
    const headerDict = {
      'api-key': 'apa'
    }
    let httpParams = new HttpParams()
    if (request.term) {
      httpParams = httpParams.set('q', request.term)
    }
    request.stats.forEach(element => {
      httpParams = httpParams.append('stats', element)
    })
    if (request.criterias != undefined) {
      request.criterias.forEach(element => {
        let type = element.type
        httpParams = httpParams.append(type, element.code)
      })
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
      params: httpParams
    }
    return this.http.get<SearchAdResponse>(`${this.adsUrl}/search`, requestOptions);
  }

  complete(term: string, request: SearchAdRequest): Observable<CompleteResponse> {
    if (!term) {
      return of(new CompleteResponse());
    }
    const headerDict = {
      'api-key': 'apa'
    }

    let httpParams = new HttpParams()
    httpParams = httpParams.set('q', term)
    if (request.criterias != undefined) {
      request.criterias.forEach(element => {
        let type = element.type
        httpParams = httpParams.append(type, element.code)
      })
    }
    
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
      params: httpParams
    }

    return this.http.get<CompleteResponse>(`${this.adsUrl}/complete`, requestOptions);
  }

  criteriaSearch(term: string): Observable<CriteriaSearchResponse> {
    if (!term) {
      return NEVER
    }
    const headerDict = {
      'api-key': 'apa'
    }

    let httpParams = new HttpParams()
    httpParams = httpParams.set('q', term)
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
      params: httpParams
    }

    return this.http.get<CriteriaSearchResponse>(`${this.adsUrl}/taxonomy/search`, requestOptions);
  }
}

export class SearchAdRequest {
  term: string
  stats: Array<string>
  criterias: Array<SearchCriteria>
}

export class SearchStatsValue {
  code: string
  count: number
  term: string
}

export class SearchStats {
  type: string
  values: Array<SearchStatsValue>
}

export class SearchAdResponse {
  total: number
  hits: Array<Ad>
  stats: Array<SearchStats>
}

export class CompleteResponse {
  typeahead: [string];
}

export class CriteriaSearchResponse {
  result: Array<VfSearchCriteria>
}

export class VfSearchCriteria {
  conceptId: string
  id: string
  term: string
  typ: string
  type: string
  parentId: string
}
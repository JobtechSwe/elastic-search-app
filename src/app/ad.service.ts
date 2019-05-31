import { Injectable } from '@angular/core';
import { Ad } from './model/ad';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, NEVER } from 'rxjs';
import { SearchCriteria } from './model/search-criteria';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient) {
    this.jsEnvironements = [
      new JSEnvironment("Production", "https://open-api.dev.services.jtech.se", "cGF0cmlrLm9sc3NvbkBhcmJldHNmb3JtZWRsaW5nZW4uc2U"),
      new JSEnvironment("Staging", "https://staging-jobs.dev.services.jtech.se", "apa"),
      new JSEnvironment("Dev", "https://dev-open-api.dev.services.jtech.se/", "apa"),
      new JSEnvironment("i1", "https://i1-open-api.dev.services.jtech.se/", "apa")
    ]
    this.selectedEnvironment = this.jsEnvironements[0]
   }

  jsEnvironements: JSEnvironment[]
  selectedEnvironment: JSEnvironment
  statsLimit: number = null

  getAds(request: SearchAdRequest): Observable<SearchAdResponse> {
    const headerDict = {
      'api-key': this.selectedEnvironment.apiKey
    }
    let httpParams = new HttpParams()
    if (request.term) {
      httpParams = httpParams.set('q', request.term)
    }
    if (this.statsLimit != null) {
      httpParams = httpParams.set('stats.limit', this.statsLimit.toString())
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
    return this.http.get<SearchAdResponse>(`${this.selectedEnvironment.url}/search`, requestOptions);
  }

  complete(term: string, request: SearchAdRequest): Observable<CompleteResponse> {
    if (!term) {
      return of(new CompleteResponse());
    }
    const headerDict = {
      'api-key': this.selectedEnvironment.apiKey
    }

    let httpParams = new HttpParams()
    httpParams = httpParams.set('q', term.toLocaleLowerCase())
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

    return this.http.get<CompleteResponse>(`${this.selectedEnvironment.url}/complete`, requestOptions);
  }

  criteriaSearch(term: string): Observable<CriteriaSearchResponse> {
    if (!term) {
      return NEVER
    }
    const headerDict = {
      'api-key': this.selectedEnvironment.apiKey
    }

    let httpParams = new HttpParams()
    httpParams = httpParams.set('q', term)
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
      params: httpParams
    }

    return this.http.get<CriteriaSearchResponse>(`${this.selectedEnvironment.url}/taxonomy/search`, requestOptions);
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
  freetext_concepts: FreeTextConcepts
}

export class CompleteResponse {
  typeahead: [CompleteValue];
}

export class CompleteValue {
  occurrences: number
  type: string
  value: string
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

export class JSEnvironment {
  title: string
  url: string
  apiKey: string

  constructor(title: string, url: string, apiKey: string) {
    this.title = title
    this.url = url
    this.apiKey = apiKey
  }
}

export class FreeTextConcepts {
  location: Array<string>
  location_must: Array<string>
  location_must_not: Array<string>
  occupation: Array<string>
  occupation_must: Array<string>
  occupation_must_not: Array<string>
  skill: Array<string>
  skill_must: Array<string>
  skill_must_not: Array<string>
  trait: Array<string>
  trait_must: Array<string>
  trait_must_not: Array<string>
}
import { Injectable } from '@angular/core';
import { Ad } from './model/ad';
import { HttpClient, HttpHeaders, HttpParams, HttpParameterCodec } from '@angular/common/http';
//import { Observable, of, NEVER } from 'rxjs';
import { SearchCriteria } from './model/search-criteria';
import { Observable, of, NEVER } from 'rxjs';
import { map, tap, publishReplay, refCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient) {
    this.jsEnvironements = [
      new JSEnvironment("Production", "https://jobsearch.api.jobtechdev.se", "cGF0cmlrLm9sc3NvbkBhcmJldHNmb3JtZWRsaW5nZW4uc2U"),
      new JSEnvironment("Staging", "https://staging-jobsearch-api.jobtechdev.se", "cGF0cmlrLm9sc3NvbkBhcmJldHNmb3JtZWRsaW5nZW4uc2U"),
      new JSEnvironment("Dev", "https://dev-jobsearch-api.jobtechdev.se", "cGF0cmlrLm9sc3NvbkBhcmJldHNmb3JtZWRsaW5nZW4uc2U")
    ]
    this.selectedEnvironment = this.jsEnvironements[0]
   }

  jsEnvironements: JSEnvironment[]
  selectedEnvironment: JSEnvironment
  statsLimit: number = null
  relevanceThreshold: number = null
  availibleSortOrders = ["relevance", "pubdate-desc", "pubdate-asc", "applydate-desc", "applydate-asc", "updated"]
  sortOrder: string = null
  contextualAutocomplete: boolean = false
  freetextJoinedWithAnd: boolean = false
  allowEmptyTypeahead: boolean = true
  includeSynonymsTypeahead: boolean = true
  spellcheckTypeahead: boolean = true
  suggestExtraWordTypeahead: boolean = true
  publishedAfterMinutes: number = 0
  employer: [string] = null
  drivingLicenseRequired: string = null
  availibledrivingLicenseRequired = ["---", "true", "false"]

  adCache: Map<number, Observable<Ad>> = new Map

  headerDict(): Record<string, any> {
    var headers:  Record<string, any> = {}
    headers['api-key'] = this.selectedEnvironment.apiKey
    if (this.freetextJoinedWithAnd != true) {
      headers['x-feature-freetext-bool-method'] = 'or'
    }
    if (this.allowEmptyTypeahead == true) {
      headers['x-feature-allow-empty-typeahead'] = 'true'
    }
    if (this.includeSynonymsTypeahead == true) {
      headers['x-feature-include-synonyms-typeahead'] = 'true'
    }
    if (this.spellcheckTypeahead == true) {
      headers['x-feature-spellcheck-typeahead'] = 'true'
    }
    if (this.suggestExtraWordTypeahead == true) {
      headers['x-feature-suggest-extra-word'] = 'true'
    }
    return headers
  }

  getAd(adid: number): Observable<Ad> {
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict()),
      params: new HttpParams({ encoder: new CustomHttpParamEncoder() })
    }

    let cachedAd = this.adCache.get(adid)
    console.log('cache count: ' + this.adCache.size)
    if (cachedAd != undefined) {
      console.log('use cached ad: ' + adid)
      let cachedAd = this.adCache.get(adid)
      return cachedAd
    } else {
      let observable =  this.http.get<Ad>(`${this.selectedEnvironment.url}/ad/` + adid, requestOptions).pipe(
        publishReplay(1)
        ,refCount()
      )
      console.log('cache ad: ' + adid)
      this.adCache.set(adid, observable)
      return observable
    }
  }

  getAds(request: SearchAdRequest): Observable<SearchAdResponse> {
    let httpParams = new HttpParams({ encoder: new CustomHttpParamEncoder() })
    if (request.term) {
      httpParams = httpParams.set('q', request.term)
    }
    if (this.statsLimit != null) {
      httpParams = httpParams.set('stats.limit', this.statsLimit.toString())
    }
    if (this.relevanceThreshold != null) {
      httpParams = httpParams.set('relevance-threshold', this.relevanceThreshold.toString())
    }
    if (this.sortOrder != null) {
      httpParams = httpParams.set('sort', this.sortOrder)
    }
    if (this.publishedAfterMinutes > 0) {
      httpParams = httpParams.set('published-after', this.publishedAfterMinutes.toString())
    }
    if (this.employer != null) {
      this.employer.forEach(emp => {
        let trimmedEmp = emp.trim()
        if (trimmedEmp.length > 0) {
          httpParams = httpParams.append('employer', emp.trim())
        }
      });
    }

    if (this.drivingLicenseRequired != null && this.drivingLicenseRequired != "---") {
      httpParams = httpParams.set('driving-license-required', this.drivingLicenseRequired)
    }

    httpParams = httpParams.set('limit', request.limit.toString())
    httpParams = httpParams.set('offset', request.offset.toString())

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
      headers: new HttpHeaders(this.headerDict()),
      params: httpParams
    }
    return this.http.get<SearchAdResponse>(`${this.selectedEnvironment.url}/search`, requestOptions);
  }

  complete(term: string, request: SearchAdRequest): Observable<CompleteResponse> {
    if (!term) {
      term = ''
    }

    let httpParams = new HttpParams({ encoder: new CustomHttpParamEncoder() })
    httpParams = httpParams.set('q', term)
    if (request.criterias != undefined) {
      request.criterias.forEach(element => {
        let type = element.type
        httpParams = httpParams.append(type, element.code)
      })
    }
    if (this.contextualAutocomplete == false) {
      httpParams = httpParams.append('contextual', 'false')
    }
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict()),
      params: httpParams
    }
    
    return this.http.get<CompleteResponse>(`${this.selectedEnvironment.url}/complete`, requestOptions);
  }

  criteriaSearch(term: string): Observable<CriteriaSearchResponse> {
    if (!term) {
      return NEVER
    }

    let httpParams = new HttpParams({ encoder: new CustomHttpParamEncoder() })
    httpParams = httpParams.set('q', term)
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict()),
      params: httpParams
    }

    return this.http.get<CriteriaSearchResponse>(`${this.selectedEnvironment.url}/taxonomy/search`, requestOptions);
  }
}

export class SearchAdRequest {
  term: string
  stats: Array<string>
  criterias: Array<SearchCriteria>
  limit: number = 10
  offset: number = 0
  published_before_minutes: number = 0
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
  total: { value: number}
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
  location: Array<string> = []
  location_must: Array<string> = []
  location_must_not: Array<string> = []
  occupation: Array<string> = []
  occupation_must: Array<string> = []
  occupation_must_not: Array<string> = []
  skill: Array<string> = []
  skill_must: Array<string> = []
  skill_must_not: Array<string> = []
  trait: Array<string> = []
  trait_must: Array<string> = []
  trait_must_not: Array<string> = []
}

export class CustomHttpParamEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

import { Injectable } from '@angular/core';
import { Ad } from './ad';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient) { }

  private developUrl = 'https://develop-sokannonser.dev.services.jtech.se/open';
  private productionUrl = 'https://jobs.dev.services.jtech.se/af';
  adsUrl = this.developUrl

  getAds(request: SearchAdRequest): Observable<SearchAdResponse> {
    if (!request.term) {
      return of(new SearchAdResponse());
    }
    const headerDict = {
      'api-key': 'apa'
    }
    let httpParams = new HttpParams()
    httpParams = httpParams.set('q', request.term)
    request.stats.forEach(element => {
      console.log(element)
      httpParams = httpParams.append('stats', element)
    });
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict),
      params: httpParams
    };
    return this.http.get<SearchAdResponse>(`${this.adsUrl}/search`, requestOptions);
  }

  complete(term: string): Observable<CompleteResponse> {
    if (!term) {
      return of(new CompleteResponse());
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
    
    return this.http.get<CompleteResponse>(`${this.adsUrl}/complete`, requestOptions);
  }
}

export class SearchAdRequest {
  term: string
  stats: Array<string>
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
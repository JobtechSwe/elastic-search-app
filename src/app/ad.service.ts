import { Injectable } from '@angular/core';
import { Ad } from './ad';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient) { }

  private developUrl = 'https://develop-sokannonser.dev.services.jtech.se/open';
  private productionUrl = 'https://jobs.dev.services.jtech.se/af';
  adsUrl = this.developUrl

  getAds(term: string): Observable<SearchAdResponse> {
    if (!term.trim()) {
      return of(new SearchAdResponse());
    }
    const headerDict = {
      'api-key': 'apa'
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return this.http.get<SearchAdResponse>(`${this.adsUrl}/search?q=${term}`, requestOptions);
  }

  complete(term: string): Observable<CompleteResponse> {
    if (!term.trim()) {
      return of(new CompleteResponse());
    }
    const headerDict = {
      'api-key': 'apa'
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return this.http.get<CompleteResponse>(`${this.adsUrl}/complete?q=${term}`, requestOptions);
  }
}

export class SearchAdResponse {
  total: number;
  hits: [Ad];
}

export class CompleteResponse {
  typeahead: [string];
}
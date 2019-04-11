import { Injectable } from '@angular/core';
import { Ad } from './ad';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient) { }
  
  private adsUrl = 'https://jobs.dev.services.jtech.se/af';  // URL to web api

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
    return this.http.get<SearchAdResponse>(`${this.adsUrl}/search?q=${term}&limit=10`, requestOptions);
  }
}

export class SearchAdResponse {
  total: number;
  hits: [Ad];
}
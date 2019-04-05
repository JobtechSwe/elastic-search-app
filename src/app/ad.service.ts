import { Injectable } from '@angular/core';
import { Ad } from './ad';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient) { }
  
  private adsUrl = 'https://jobs.dev.services.jtech.se/af/search?q=l%C3%A4karexamen&offset=0&limit=10';  // URL to web api

  getAds(): Observable<SearchAdResponse> {
    const headerDict = {
      'api-key': 'apa'
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return this.http.get<SearchAdResponse>(this.adsUrl, requestOptions)
  }
}

export class SearchAdResponse {
  hits: Ad[];
}
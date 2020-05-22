import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { JSEnvironment, CriteriaSearchResponse, CustomHttpParamEncoder, VfSearchCriteria } from './ad.service';
import { Observable, NEVER } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyAPIService {

  constructor(private http: HttpClient) {
    this.jsEnvironements = [
      new JSEnvironment("Production", "https://taxonomy.api.jobtechdev.se", "cGF0cmlrLm9sc3NvbkBhcmJldHNmb3JtZWRsaW5nZW4uc2U")
    ]
    this.selectedEnvironment = this.jsEnvironements[0]
   }

   jsEnvironements: JSEnvironment[]
   selectedEnvironment: JSEnvironment
   
   headerDict(): Record<string, any> {
    var headers:  Record<string, any> = {}
    headers['api-key'] = this.selectedEnvironment.apiKey
    return headers
  }

   criteriaSearch(term: string): Observable<Array<VfSearchCriteria>> {
    if (!term) {
      return NEVER
    }

    let httpParams = new HttpParams({ encoder: new CustomHttpParamEncoder() })
    httpParams = httpParams.set('query-string', term)
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict()),
      params: httpParams
    }

    return this.http.get<Object[]>(`${this.selectedEnvironment.url}/v1/taxonomy/suggesters/autocomplete`, requestOptions)
    .pipe(
      map(data => {
        return data.map(list => {
          let criteria = new VfSearchCriteria()
          criteria.id = list["taxonomy/id"]
          criteria.term = list["taxonomy/preferred-label"]
          criteria.type = list["taxonomy/type"]
          return criteria
        })
        
      })
    )
    
  }
}

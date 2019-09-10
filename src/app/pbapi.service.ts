import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PBAPIService {

  constructor(private http: HttpClient) { }

  adCache: Map<number, Observable<PBAd>> = new Map

  getAd(adid: number): Observable<PBAd> {
    const headerDict = {
      'INT_SYS': 'elastic-search-app'
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
      params: new HttpParams()
    }

    let cachedAd = this.adCache.get(adid)
    if (cachedAd != undefined) {
      let cachedAd = this.adCache.get(adid)
      return cachedAd
    } else {
      let observable =  this.http.post<PBAd>(`https://www.arbetsformedlingen.se/rest/pbapi/af/v1/matchning/matchandeRekryteringsbehov/` + adid, requestOptions).pipe(
        publishReplay(1)
        ,refCount()
      )
      this.adCache.set(adid, observable)
      return observable
    }
  }

}

export class PBAd {
  id: number
  rubrik: string
  sistaAnsokningsdatum: Date
  yrkesroll: {
    id: string
    namn: string
  }
  presentationStatus: string
  erbjudenArbetsplats: {
    kommun: {
      namn: string
    }
  }
}
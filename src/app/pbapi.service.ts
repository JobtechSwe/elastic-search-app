import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { publishReplay, refCount, map } from 'rxjs/operators';

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
      let observable = this.http.post<PBAd>(`https://www.arbetsformedlingen.se/rest/pbapi/af/v1/matchning/matchandeRekryteringsbehov/` + adid, requestOptions).pipe(
        publishReplay(1)
        , refCount()
      )
      this.adCache.set(adid, observable)
      return observable
    }
  }

  getAds(ids: Array<number>): Observable<Array<PBAd>> {
    const headerDict = {
      'INT_SYS': 'elastic-search-app'
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
      params: new HttpParams()
    }
    let body = new UrvalsBody
    body.urvalsRekryteringsbehov = ids.map(adid => {
      let behov = new UrvalsBodyRekryteringsbehov
      behov.rekryteringsbehovId = adid.toString()
      return behov
    })
    return this.http.post<UrvalsResponse>(`https://www.arbetsformedlingen.se/rest/pbapi/af/v1/matchning/matchandeRekryteringsbehov/urval`, body, requestOptions)
      .pipe(
        map(response => {
          return response.rekryteringsbehovdetaljer
        })
      );
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

export class UrvalsBody {
  urvalsRekryteringsbehov: Array<UrvalsBodyRekryteringsbehov>
}

export class UrvalsBodyRekryteringsbehov {
  rekryteringsbehovId: string
}


export class UrvalsResponse {
  rekryteringsbehovdetaljer: Array<PBAd>
}
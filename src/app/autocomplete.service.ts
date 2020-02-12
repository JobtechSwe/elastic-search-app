import { Injectable } from '@angular/core';
import { Observable, of, merge } from 'rxjs';
import { CompleteResponse, CustomHttpParamEncoder, AdService } from './ad.service';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  constructor(private http: HttpClient, private adService: AdService) { }

  contextual: boolean = true
  allowEmpty: boolean = false
  includeSynonyms: boolean = false
  completeResult: boolean = false
  extraResult: boolean = false
  spellcheckTypeahead: boolean = false

  headerDict(): Record<string, any> {
    var headers:  Record<string, any> = {}
    headers['api-key'] = this.adService.selectedEnvironment.apiKey
    if (this.allowEmpty == true) {
       headers['x-feature-allow-empty-typeahead'] = 'true'
     }
     if (this.includeSynonyms == true) {
       headers['x-feature-include-synonyms-typeahead'] = 'true'
     }
     if (this.spellcheckTypeahead == true) {
      headers['x-feature-spellcheck-typeahead'] = 'true'
    }
    return headers
  }

  private headerDictExtraAutocomplete(): Record<string, any> {
    var headers:  Record<string, any> = {}
    headers['api-key'] = this.adService.selectedEnvironment.apiKey
    headers['x-feature-allow-empty-typeahead'] = 'true'
    if (this.adService.includeSynonymsTypeahead == true) {
      headers['x-feature-include-synonyms-typeahead'] = 'true'
    }
    return headers
  }

  complete(term: string): Observable<CompleteResponse> {
    if (!term) {
      return of(new CompleteResponse());
    }

    let previuosTerm = this.stripLastWord(term)

    let httpParams = new HttpParams({ encoder: new CustomHttpParamEncoder() })
    httpParams = httpParams.set('q', term)
    httpParams = httpParams.append('contextual', this.contextual == false ? 'false' : 'true')
    
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict()),
      params: httpParams
    }

    return this.http.get<CompleteResponse>(`${this.adService.selectedEnvironment.url}/complete`, requestOptions)
    .pipe(
      mergeMap((value: CompleteResponse, index: number)  => {
        if (this.extraResult && value.typeahead.length == 1) {
          let completedWord = value.typeahead[0]
          let newTerm = previuosTerm + completedWord.value
          let newQfield = completedWord.type == "occupation" ? "location" : "occupation"
          console.log('New type ahead: ' + newTerm + ", qfiled: " + newQfield)
          return this.completeExtra(newTerm, newQfield)
          .pipe(
            map(response => {
              response.typeahead.forEach(element => {
                element.value = completedWord.value + " " + element.value
              });
              response.typeahead.unshift(completedWord)
              return response
            })
          )
        } else {
          return of(value)
        }
      }),
      mergeMap((value: CompleteResponse, index: number)  => {
        if (this.completeResult) {
          value.typeahead.forEach(element => {
            element.value = previuosTerm + " " + element.value
          })
        }
        return of(value)
      })
    )
  }

  private stripLastWord(text: string): string {
    let terms = text.split(" ")
    terms.pop()
    return terms.join(" ")
  }

  private completeExtra(term: string, qfield: string): Observable<CompleteResponse> {
    if (!term) {
      return of(new CompleteResponse());
    }

    let httpParams = new HttpParams({ encoder: new CustomHttpParamEncoder() })
    httpParams = httpParams.set('q', term + " ")
    httpParams = httpParams.set('qfields', qfield)
    httpParams = httpParams.append('contextual', 'false')
    
    const requestOptions = {
      headers: new HttpHeaders(this.headerDictExtraAutocomplete()),
      params: httpParams
    }

    return this.http.get<CompleteResponse>(`${this.adService.selectedEnvironment.url}/complete`, requestOptions);
  }
}

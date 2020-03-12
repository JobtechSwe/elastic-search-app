import { Injectable } from '@angular/core';
import { Observable, of, zip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RekAIService {

  rekIaConf = { professtionProjectId: 10161043, locationProjectId: 10161044 };
  get rekAi() {
    return window['__rekai'];
  }

  getRecomendations(professionList: string[]): Observable<Array<String>> {

    if (!this.rekAi) {
      console.warn('rekAi not loaded!', window['__rekai']);
      return <Observable<Array<String>>>of([]);
    }

    if (professionList.length > 0) {
      sessionStorage.setItem(
        'sp' + this.rekIaConf.professtionProjectId,
        JSON.stringify({ p: professionList.map(p => `cat:${p}`) })
      );
        return new Observable(sub =>
          this.rekAi.sendPredictDataToBackend(
            { ...this.rekAi.customer, projectid: this.rekIaConf.professtionProjectId },
            {
              dataset: {
                callback: data => {
                  sub.next(JSON.parse(data).predictions);
                }
              }
            }
          )
        )
    } else {
      return of([]);
    }
  }
}

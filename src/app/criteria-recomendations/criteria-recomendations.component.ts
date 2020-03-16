import { Component, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { SearchResultViewModel, StatsValueViewModel } from '../adsearch.service';
import { RekAIService } from '../rek-ai.service';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-criteria-recomendations',
  templateUrl: './criteria-recomendations.component.html',
  styleUrls: ['./criteria-recomendations.component.css']
})
export class CriteriaRecomendationsComponent implements OnInit {

  @Input() searchResult$: Observable<SearchResultViewModel>

  occupationRek: Observable<Array<String>> // Slutgiltiga rekomendation från Rek.ai
  includedBase: Array<StatsValueViewModel> // Skickat till Rek.AI
  exludedBase: Array<StatsValueViewModel> // EJ skickat till Rek.AI
  cutOfPercent = new BehaviorSubject<number>(10)
  cutOfCount = new BehaviorSubject<number>(0)
  minimumNumberOfAds = 0
  
  constructor(private rekAI: RekAIService) { }

  ngOnInit() {
    this.occupationRek = combineLatest(this.searchResult$, this.cutOfPercent, this.cutOfCount).pipe(
      flatMap(([result, cutOfPercent, cutOfCount]) => {
        if (cutOfCount == 0) {
          this.minimumNumberOfAds = Math.floor(result.total * (cutOfPercent / 100))
          this.includedBase = result.statsGroup.filter(r => r.count > this.minimumNumberOfAds)
          this.exludedBase = result.statsGroup.filter(r => r.count <= this.minimumNumberOfAds)
        } else {
          this.minimumNumberOfAds = 0
          this.includedBase = result.statsGroup.filter((r, i) => i < cutOfCount)
          this.exludedBase = result.statsGroup.filter((r, i) => i >= cutOfCount)
        }
        let onlyNames = this.includedBase.map(r => r.term)
        return this.rekAI.getRecomendations(onlyNames)
      })
    )
  }

}
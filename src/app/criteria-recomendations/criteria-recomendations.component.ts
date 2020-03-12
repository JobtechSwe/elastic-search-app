import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResultViewModel } from '../adsearch.service';
import { RekAIService } from '../rek-ai.service';
import { flatMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-criteria-recomendations',
  templateUrl: './criteria-recomendations.component.html',
  styleUrls: ['./criteria-recomendations.component.css']
})
export class CriteriaRecomendationsComponent implements OnInit {

  @Input() searchResult$: Observable<SearchResultViewModel>

  occupationRek: Observable<Array<String>>
  professionList: Array<string>
  
  constructor(private rekAI: RekAIService) { }

  ngOnInit() {
    this.occupationRek = this.searchResult$.pipe(
      flatMap(result => {
        this.professionList = result.statsGroup.map(r => r.term)
        return this.rekAI.getRecomendations(this.professionList)
      })
    )
  }

}

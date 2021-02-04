import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { AdService } from '../ad.service';
import { AdsearchService, SearchResultViewModel } from '../adsearch.service';

@Component({
  selector: 'app-did-you-mean',
  templateUrl: './did-you-mean.component.html',
  styleUrls: ['./did-you-mean.component.css']
})
export class DidYouMeanComponent implements OnInit {

  @Input() searchResult$: Observable<SearchResultViewModel>

  suggestions: Observable<Array<String>>
  
  constructor(private adSrv: AdService, private searchSrv: AdsearchService) { }

  ngOnInit() {
    this.suggestions = this.searchResult$.pipe(
      flatMap(result => {
        return this.adSrv.didYouMean(this.searchSrv.currentSearch).pipe(
          map(suggestions => {
            return suggestions.typeahead.map(s => { return `${s.value} (${s.occurrences})` })
          })
        )
      })
    )
  }

}

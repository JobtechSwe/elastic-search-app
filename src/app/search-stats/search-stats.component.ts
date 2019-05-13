import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchResultViewModel } from '../adsearch.service';
import { Observable } from 'rxjs';
import { MatListOption } from '@angular/material';

@Component({
  selector: 'app-search-stats',
  templateUrl: './search-stats.component.html',
  styleUrls: ['./search-stats.component.css']
})
export class SearchStatsComponent implements OnInit {

  @Input() searchResult$: Observable<SearchResultViewModel>

  @Output() selectedStats = new EventEmitter()
  
  constructor() { }

  ngOnInit() {
  }

  selectStats(selectedStats: Array<MatListOption>) {
    this.selectedStats.next(selectedStats)
  }
}

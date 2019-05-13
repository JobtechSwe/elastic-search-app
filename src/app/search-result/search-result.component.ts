import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResultViewModel } from '../ads/ads.component';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  @Input() searchResult$: Observable<SearchResultViewModel>

  constructor() { }

  ngOnInit() {
  }

}

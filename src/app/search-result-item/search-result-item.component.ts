import { Component, OnInit, Input } from '@angular/core';
import { AdViewModel } from '../adsearch.service';

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.css']
})
export class SearchResultItemComponent implements OnInit {

  @Input() ad: AdViewModel
  isCollapsed = false

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResultViewModel, AdsearchService } from '../adsearch.service';
import { PageEvent, MatPaginator } from '@angular/material';
import { AdService } from '../ad.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  @Input() searchResult$: Observable<SearchResultViewModel>

  @ViewChild(MatPaginator, { read: MatPaginator, static: false}) paginator: MatPaginator;
  
  constructor(public adService: AdService, public searchService: AdsearchService) { }

  ngOnInit() {
    this.searchResult$.subscribe(result => {
      this.paginator.length = result.total
      this.paginator.pageSize = this.searchService.currentSearch.limit
      if (this.searchService.currentSearch.offset == 0) {
        this.paginator.firstPage()
      }
    })
  }

  onPaginate(event:PageEvent) {
    this.searchService.paginate(event.pageIndex, event.pageSize)
  }

}

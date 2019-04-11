import { Component, OnInit } from '@angular/core';
import { AdService } from '../ad.service';
import { Ad } from '../ad'
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap, map, tap
} from 'rxjs/operators';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  loading: boolean = false;
  searchAds: Observable<[Ad]>;
  totalNumberOfAds: Observable<number>;
  private searchTerms = new Subject<string>();

  constructor(private adService: AdService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {

    const result = this.searchTerms.pipe(
      tap(() => this.loading = true),
      switchMap((term: string) => this.adService.getAds(term)),
      tap( () => this.loading = false )
    );
    this.searchAds = result.pipe(
      map(res => res.hits)
    )
    this.totalNumberOfAds = result.pipe(
      map(res => res.total)
    )

  }

}

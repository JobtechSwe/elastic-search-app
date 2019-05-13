import { Component, OnInit } from '@angular/core';
import { AdsearchService } from '../adsearch.service';

@Component({
  selector: 'app-simple-search',
  templateUrl: './simple-search.component.html',
  styleUrls: ['./simple-search.component.css']
})
export class SimpleSearchComponent implements OnInit {

  constructor(private searchService: AdsearchService) { }

  ngOnInit() {
  }

}

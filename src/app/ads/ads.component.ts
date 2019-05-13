import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatListOption } from '@angular/material';
import { SearchCriteria } from '../model/search-criteria';
import { AdsearchService } from '../adsearch.service';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  constructor(private searchService: AdsearchService) { }

  ngOnInit(): void {}

}
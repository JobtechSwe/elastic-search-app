import { Component, OnInit } from '@angular/core';
import { AdService } from '../ad.service';
import { AdsearchService } from '../adsearch.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.css']
})
export class SearchOptionsComponent implements OnInit {

  employerControl = new FormControl()
  
  constructor(public adService: AdService, public searchService: AdsearchService) { }

  ngOnInit() {
    let valueChangeSubject = this.employerControl.valueChanges

    valueChangeSubject.subscribe(value => {
      this.adService.employer = value.split(',')
    })
  }

}

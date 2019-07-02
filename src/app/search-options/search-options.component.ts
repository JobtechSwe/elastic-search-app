import { Component, OnInit } from '@angular/core';
import { AdService } from '../ad.service';

@Component({
  selector: 'app-search-options',
  templateUrl: './search-options.component.html',
  styleUrls: ['./search-options.component.css']
})
export class SearchOptionsComponent implements OnInit {

  constructor(public adService: AdService) { }

  ngOnInit() {
  }

}

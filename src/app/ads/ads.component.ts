import { Component, OnInit } from '@angular/core';
import { Ad } from '../ad';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ad: Ad = {
    id: 1,
    name: 'Windstorm'
  };
}

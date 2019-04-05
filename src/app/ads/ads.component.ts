import { Component, OnInit } from '@angular/core';
import { Ad } from '../ad';
import { AdService } from '../ad.service';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  constructor(private adService: AdService) { }

  ngOnInit() {
    this.getAds();
  }

  ads: Ad[];

  getAds(): void {
    this.ads = this.adService.getAds();
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { AdService } from '../ad.service';
import { Observable } from 'rxjs';
import { Ad } from '../model/ad';

@Component({
  selector: 'app-ad-list-item',
  templateUrl: './ad-list-item.component.html',
  styleUrls: ['./ad-list-item.component.css']
})
export class AdListItemComponent implements OnInit {

  @Input() adID: number
  ad$: Observable<Ad>
  
  constructor(private adService: AdService) { }

  ngOnInit() {
    this.ad$ = this.adService.getAd(this.adID)
  }

}

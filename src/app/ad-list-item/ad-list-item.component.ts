import { Component, OnInit, Input } from '@angular/core';
import { AdService } from '../ad.service';
import { Observable, throwError } from 'rxjs';
import { Ad } from '../model/ad';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-ad-list-item',
  templateUrl: './ad-list-item.component.html',
  styleUrls: ['./ad-list-item.component.css']
})
export class AdListItemComponent implements OnInit {

  @Input() adID: number
  ad$: Observable<Ad>
  errorObject = null
  
  constructor(private adService: AdService) { }

  ngOnInit() {
    this.ad$ = this.adService.getAd(this.adID).pipe(
      catchError(err => {
        this.errorObject = err;
        return throwError(err);
      })
    )
  }

}

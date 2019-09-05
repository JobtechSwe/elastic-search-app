import { Component, OnInit, Input } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PBAPIService, PBAd } from '../pbapi.service';

@Component({
  selector: 'app-ad-list-item',
  templateUrl: './ad-list-item.component.html',
  styleUrls: ['./ad-list-item.component.css']
})
export class AdListItemComponent implements OnInit {

  @Input() adID: number
  ad$: Observable<PBAd>
  errorObject = null
  
  constructor(private adService: PBAPIService) { }

  ngOnInit() {
    this.ad$ = this.adService.getAd(this.adID).pipe(
      catchError(err => {
        this.errorObject = err;
        return throwError(err);
      })
    )
  }

}

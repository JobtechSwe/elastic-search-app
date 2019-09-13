import { Component, OnInit, Input } from '@angular/core';
import { PBAd } from '../pbapi.service';

@Component({
  selector: 'app-ad-list-item',
  templateUrl: './ad-list-item.component.html',
  styleUrls: ['./ad-list-item.component.css']
})
export class AdListItemComponent implements OnInit {

  @Input() ad: PBAd
  
  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ad-list-item',
  templateUrl: './ad-list-item.component.html',
  styleUrls: ['./ad-list-item.component.css']
})
export class AdListItemComponent implements OnInit {

  @Input() adID: number
  
  constructor() { }

  ngOnInit() {
  }

}

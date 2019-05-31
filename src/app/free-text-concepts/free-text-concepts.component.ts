import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResultViewModel } from '../adsearch.service';

@Component({
  selector: 'app-free-text-concepts',
  templateUrl: './free-text-concepts.component.html',
  styleUrls: ['./free-text-concepts.component.css']
})
export class FreeTextConceptsComponent implements OnInit {

  @Input() searchResult$: Observable<SearchResultViewModel>
  
  constructor() { }

  ngOnInit() {
  }

}

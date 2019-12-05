import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBoxPrototypeComponent } from './search-box-prototype.component';

describe('SearchBoxPrototypeComponent', () => {
  let component: SearchBoxPrototypeComponent;
  let fixture: ComponentFixture<SearchBoxPrototypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBoxPrototypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxPrototypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

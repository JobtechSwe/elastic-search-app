import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdListItemComponent } from './ad-list-item.component';

describe('AdListItemComponent', () => {
  let component: AdListItemComponent;
  let fixture: ComponentFixture<AdListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaRecomendationsComponent } from './criteria-recomendations.component';

describe('CriteriaRecomendationsComponent', () => {
  let component: CriteriaRecomendationsComponent;
  let fixture: ComponentFixture<CriteriaRecomendationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriteriaRecomendationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaRecomendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

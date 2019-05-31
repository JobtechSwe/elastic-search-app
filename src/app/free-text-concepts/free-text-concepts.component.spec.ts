import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTextConceptsComponent } from './free-text-concepts.component';

describe('FreeTextConceptsComponent', () => {
  let component: FreeTextConceptsComponent;
  let fixture: ComponentFixture<FreeTextConceptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeTextConceptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTextConceptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompletePrototypeComponent } from './autocomplete-prototype.component';

describe('AutocompletePrototypeComponent', () => {
  let component: AutocompletePrototypeComponent;
  let fixture: ComponentFixture<AutocompletePrototypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompletePrototypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompletePrototypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

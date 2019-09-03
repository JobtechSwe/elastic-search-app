import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IFAUExplorerComponent } from './ifauexplorer.component';

describe('IFAUExplorerComponent', () => {
  let component: IFAUExplorerComponent;
  let fixture: ComponentFixture<IFAUExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IFAUExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IFAUExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

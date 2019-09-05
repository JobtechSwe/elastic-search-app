import { TestBed } from '@angular/core/testing';

import { PBAPIService } from './pbapi.service';

describe('PBAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PBAPIService = TestBed.get(PBAPIService);
    expect(service).toBeTruthy();
  });
});

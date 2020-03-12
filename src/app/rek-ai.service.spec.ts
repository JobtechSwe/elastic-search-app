import { TestBed } from '@angular/core/testing';

import { RekAIService } from './rek-ai.service';

describe('RekAIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RekAIService = TestBed.get(RekAIService);
    expect(service).toBeTruthy();
  });
});

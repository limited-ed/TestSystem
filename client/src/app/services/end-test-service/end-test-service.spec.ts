import { TestBed } from '@angular/core/testing';

import { EndTestService } from './end-test-service';

describe('EndTestService', () => {
  let service: EndTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

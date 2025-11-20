import { TestBed } from '@angular/core/testing';

import { StartTest } from './start-test';

describe('StartTest', () => {
  let service: StartTest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartTest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

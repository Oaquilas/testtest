import { TestBed } from '@angular/core/testing';

import { CheckLoadingService } from './check-loading.service';

describe('CheckLoadingService', () => {
  let service: CheckLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ServiceKlispayService } from './service-klispay.service';

describe('ServiceKlispayService', () => {
  let service: ServiceKlispayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceKlispayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

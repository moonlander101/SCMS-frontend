import { TestBed } from '@angular/core/testing';

import { VendorSignupService } from './vendor-signup.service';

describe('VendorSignupService', () => {
  let service: VendorSignupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorSignupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

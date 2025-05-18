import { TestBed } from '@angular/core/testing';

import { SupplierSignupService } from './supplier-signup.service';

describe('SupplierSignupService', () => {
  let service: SupplierSignupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierSignupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

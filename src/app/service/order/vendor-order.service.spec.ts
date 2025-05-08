import { TestBed } from '@angular/core/testing';

import { VendorOrderService } from './vendor-order.service';

describe('VendorOrderService', () => {
  let service: VendorOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

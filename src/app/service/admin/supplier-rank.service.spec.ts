import { TestBed } from '@angular/core/testing';

import { SupplierRankService } from './supplier-rank.service';

describe('SupplierRankService', () => {
  let service: SupplierRankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierRankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

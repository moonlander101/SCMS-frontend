import { TestBed } from '@angular/core/testing';

import { TruckAddService } from './truck-add.service';

describe('TruckAddService', () => {
  let service: TruckAddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruckAddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

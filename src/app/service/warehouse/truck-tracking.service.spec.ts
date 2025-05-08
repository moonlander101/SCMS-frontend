import { TestBed } from '@angular/core/testing';

import { TruckTrackingService } from './truck-tracking.service';

describe('TruckTrackingService', () => {
  let service: TruckTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruckTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

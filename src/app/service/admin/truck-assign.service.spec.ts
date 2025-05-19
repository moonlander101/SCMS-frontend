import { TestBed } from '@angular/core/testing';

import { TruckAssignService } from './truck-assign.service';

describe('TruckAssignService', () => {
  let service: TruckAssignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruckAssignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

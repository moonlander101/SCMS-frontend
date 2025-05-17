import { TestBed } from '@angular/core/testing';

import { CurrentRequestService } from './current-request.service';

describe('CurrentRequestService', () => {
  let service: CurrentRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

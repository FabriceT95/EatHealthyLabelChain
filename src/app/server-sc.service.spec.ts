import {TestBed} from '@angular/core/testing';

import {ServerSCService} from './server-sc.service';

describe('ServerSCService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerSCService = TestBed.get(ServerSCService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { IPFSService } from './ipfs.service';

describe('IPFSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IPFSService = TestBed.get(IPFSService);
    expect(service).toBeTruthy();
  });
});

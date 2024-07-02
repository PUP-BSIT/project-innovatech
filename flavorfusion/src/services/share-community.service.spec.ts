import { TestBed } from '@angular/core/testing';

import { ShareCommunityService } from './share-community.service';

describe('ShareCommunityService', () => {
  let service: ShareCommunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareCommunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

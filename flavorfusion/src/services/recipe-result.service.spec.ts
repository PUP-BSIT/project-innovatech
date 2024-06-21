import { TestBed } from '@angular/core/testing';

import { RecipeResultService } from './recipe-result.service';

describe('RecipeResultService', () => {
  let service: RecipeResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

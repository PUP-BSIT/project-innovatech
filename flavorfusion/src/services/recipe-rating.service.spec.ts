import { TestBed } from '@angular/core/testing';

import { RecipeRatingService } from './recipe-rating.service';

describe('RecipeRatingService', () => {
  let service: RecipeRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

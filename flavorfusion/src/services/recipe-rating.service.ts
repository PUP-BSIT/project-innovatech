import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class RecipeRatingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  submitRating(
    recipeId: number, 
    userId: number, 
    rating: number
  ): Observable<any> {
    const url = `${this.apiUrl}/get_recipe_rating.php`;
    return this.http.post(url, { 
      recipe_id: recipeId, 
      user_id: userId, 
      rating 
    });
  }

  getAverageRating(
    recipeId: number
  ): Observable<{ averageRating: number, ratingCount: number }> {
    const url = `${this.apiUrl}/get_average_rating.php`;
    return this.http.get<{ averageRating: number, ratingCount: number }>(
      `${url}?recipe_id=${recipeId}`
    )
    .pipe(
      map(response => ({
        averageRating: response.averageRating,
        ratingCount: response.ratingCount
      })) 
    );
  }
}

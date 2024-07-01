import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
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
}

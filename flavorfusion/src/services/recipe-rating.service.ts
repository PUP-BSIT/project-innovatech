import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeRatingService {
  private apiUrl = 'https://localhost/controller'; 

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

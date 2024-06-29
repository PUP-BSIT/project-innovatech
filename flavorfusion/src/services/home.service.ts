import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = environment.apiUrl;
  
  private dailyMealsUrl = `${this.apiUrl}/get_daily_meals.php`;
  private filteredRecipesUrl = `${this.apiUrl}/get_filtered_recipes.php`;
  private userRecipesUrl = `${this.apiUrl}/get_user_recipes.php`;
  private popularRecipesUrl = `${this.apiUrl}/get_popular_recipes.php`;

  constructor(private http: HttpClient) { }

  getDailyMeals(): Observable<any> {
    return this.http.get<any>(this.dailyMealsUrl);
  }

  getFilteredRecipes(filters: string[]): Observable<any> {
    return this.http.post<any>(this.filteredRecipesUrl, filters);
  }

  getUserRecipes(): Observable<any> {
    return this.http.get<any>(this.userRecipesUrl, { withCredentials: true });
  }

  getPopularRecipes(): Observable<any> {
    return this.http.get<any>(this.popularRecipesUrl);
  }
}

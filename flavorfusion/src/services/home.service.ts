import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private dailyMealsUrl = 'http://localhost/controller/get_daily_meals.php';
  private filteredRecipesUrl = 'http://localhost/controller/get_filtered_recipes.php';
  private userRecipesUrl = 'http://localhost/controller/get_user_recipes.php';
  private popularRecipesUrl = 'http://localhost/controller/get_popular_recipes.php';

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
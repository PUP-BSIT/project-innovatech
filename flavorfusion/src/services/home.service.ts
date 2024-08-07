import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class HomeService {
  private apiUrl = environment.apiUrl;
  
  private dailyMealsUrl = `${this.apiUrl}/get_daily_meals.php`;
  private filteredRecipesUrl = `${this.apiUrl}/get_filtered_recipes.php`;
  private userRecipesUrl = `${this.apiUrl}/get_user_recipes.php`;
  private popularRecipesUrl = `${this.apiUrl}/get_popular_recipes.php`;
  private deleteRecipeUrl = `${this.apiUrl}/delete_recipe.php`;
  private recipeDetailsUrl = `${this.apiUrl}/get_recipe_details.php`;
  private updateRecipeUrl = `${this.apiUrl}/update_recipe.php`;

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

  deleteUserRecipe(recipeId: number): Observable<any> {
    return this.http.post<any>(
      this.deleteRecipeUrl, { recipe_id: recipeId }, { withCredentials: true });
  }

  getRecipeDetails(recipeId: number): Observable<any> {
    return this.http.get<any>(`${this.recipeDetailsUrl}?id=${recipeId}`);
  }

  updateRecipe(recipe: any): Observable<any> {
    return this.http.post<any>(
      this.updateRecipeUrl, recipe, { withCredentials: true });
  }
}
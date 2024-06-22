import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../model/recipe'; 

@Injectable({
  providedIn: 'root'
})
export class RecipeResultService {
  private searchUrl = 'http://localhost/controller/search.php';
  private detailsUrl = 'http://localhost/controller/get_recipe_details.php'; 

  constructor(private http: HttpClient) { }

  searchRecipes(
    query: string, 
    mealType: string, 
    dietaryPref: string, 
    ingredient: string
  ): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.searchUrl, {
      params: { keyword: query, mealType, dietaryPref, ingredient }
    });
  }

  getRecipeDetails(id: number): Observable<any> {
    return this.http.get<any>(this.detailsUrl, {
      params: { id: id.toString() }
    });
  }
}

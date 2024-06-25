import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Recipe } from '../model/recipe'; 
import { catchError } from 'rxjs/operators';
import { LoginAuthentication } from './login-authentication.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeResultService {
  private searchUrl = 'http://localhost/controller/search.php';
  private detailsUrl = 'http://localhost/controller/get_recipe_details.php'; 
  private saveRecipeUrl = 'http://localhost/controller/saved_recipes.php';
  private unsaveRecipeUrl = 'http://localhost/controller/unsave_recipe.php'; 
  private checkSavedUrl = 'http://localhost/controller/check_saved_recipe.php';

  constructor(
    private http: HttpClient, private authService: LoginAuthentication) { }

  searchRecipes(
    query: string, 
    mealType: string, 
    dietaryPref: string, 
    ingredient: string
  ): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.searchUrl, {
      params: { keyword: query, mealType, dietaryPref, ingredient }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getRecipeDetails(id: number): Observable<any> {
    return this.http.get<any>(this.detailsUrl, {
      params: { id: id.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  saveRecipe(user_id: number, recipe_id: number): Observable<any> {
    const body = { user_id, recipe_id };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.saveRecipeUrl, body, { headers })
      .pipe(
        map(response => {
          if (response.saved) {
            console.warn('Recipe already saved');
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  unsaveRecipe(user_id: number, recipe_id: number): Observable<any> {
    const body = { user_id, recipe_id };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.unsaveRecipeUrl, body, { headers })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  checkIfRecipeSaved(user_id: number, recipe_id: number): Observable<boolean> {
    const params = { user_id: user_id.toString(), recipe_id: recipe_id.toString() };

    return this.http.get<any>(this.checkSavedUrl, { params })
      .pipe(
        map(response => response.saved),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something bad happened; please try again later.';
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(errorMessage);
  }
}

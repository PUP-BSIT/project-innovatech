import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Recipe } from '../model/recipe';
import { environment } from '../environments/environment';
import { LoginAuthentication } from './login-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeResultService {
  private apiUrl = environment.apiUrl;

  private searchUrl = `${this.apiUrl}/search.php`;
  private detailsUrl = `${this.apiUrl}/get_recipe_details.php`;
  private saveRecipeUrl = `${this.apiUrl}/saved_recipes.php`;
  private unsaveRecipeUrl = `${this.apiUrl}/unsave_recipe.php`;
  private checkSavedUrl = `${this.apiUrl}/check_saved_recipe.php`;
  private submitRatingUrl = `${this.apiUrl}/get_recipe_rating.php`;
  private checkRatingUrl = `${this.apiUrl}/check_recipe_rating.php`; 

  constructor(private http: HttpClient, private authService: LoginAuthentication) { }

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

  checkIfRecipeRated(user_id: number, recipe_id: number): Observable<boolean> {
    const url = `${this.checkRatingUrl}/check_recipe_rating.php`;
    const params = { user_id: user_id.toString(), recipe_id: recipe_id.toString() };

    return this.http.get<any>(url, { params })
      .pipe(
        map(response => response.hasRated),
        catchError(this.handleError)
      );
  }

  submitRating(
    recipe_id: number,
    user_id: number,
    rating: number
  ): Observable<any> {
    const body = { recipe_id, user_id, rating };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.submitRatingUrl, body, { headers })
      .pipe(
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
        `body was: ${error.error}`
      );
    }
    return throwError(errorMessage);
  }
}

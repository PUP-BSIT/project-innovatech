import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Recipe } from '../model/recipe';

@Injectable()
export class SearchService {

  private searchUrl = `${environment.apiUrl}/search.php`;

  constructor(private http: HttpClient) { }

  searchRecipes(
    keyword: string, 
    mealType: string, 
    dietaryPref: string, 
    ingredient: string
  ): Observable<Recipe[]> {  
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('mealType', mealType)
      .set('dietaryPref', dietaryPref)
      .set('ingredient', ingredient);

    return this.http.get<Recipe[]>(this.searchUrl, { params });  
  }
}
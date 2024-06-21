import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchUrl = 'http://localhost/flavorfusion/controller/search.php';

  constructor(private http: HttpClient) { }

  searchRecipes(keyword: string, mealType: string, dietaryPref: string, ingredient: string): Observable<any> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('mealType', mealType)
      .set('dietaryPref', dietaryPref)
      .set('ingredient', ingredient);

    return this.http.get<any>(this.searchUrl, { params });
  }
}
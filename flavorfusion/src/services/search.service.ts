import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchUrl = 'http://localhost/flavorfusion/controller/search.php';

  constructor(private http: HttpClient) {}

  searchRecipes(keyword: string): Observable<any> {
    return this.http.get<any>(`${this.searchUrl}?keyword=${keyword}`);
  }
}

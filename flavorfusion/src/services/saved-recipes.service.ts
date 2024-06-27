import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SavedRecipesService {

  private apiUrl = 'http://localhost/controller/get_saved_recipes.php'; 
  
  constructor(private http: HttpClient) {}

  getSavedRecipes(userId: number, page: number = 1, pageSize: number = 3): Observable<any> {
    console.log(`Fetching saved recipes for user ID: ${userId}, page: ${page}, pageSize: ${pageSize}`);
    return this.http.get<any>(`${this.apiUrl}?user_id=${userId}&page=${page}&page_size=${pageSize}`);
  }
}

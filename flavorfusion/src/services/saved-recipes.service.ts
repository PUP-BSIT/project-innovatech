import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable()
export class SavedRecipesService {

  private apiUrl = `${environment.apiUrl}/get_saved_recipes.php`; 
  
  constructor(private http: HttpClient) {}

  getSavedRecipes(userId: number, page: number = 1, pageSize: number = 3): 
    Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?
      user_id=${userId}&page=${page}
      &page_size=${pageSize}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private apiUrl = `${environment.apiUrl}/add_recipe.php`;

  constructor(private http: HttpClient) { }

  addRecipe(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
  
}

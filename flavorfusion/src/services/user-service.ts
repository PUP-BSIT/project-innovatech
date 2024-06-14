import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost/controller/get_user_profile.php';

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}

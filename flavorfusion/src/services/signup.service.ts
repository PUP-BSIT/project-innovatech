import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SignupService {
  private apiUrl = 'http://localhost/api_flavorfusion/signup.php';

  constructor(private http: HttpClient) {}

  signup(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
}

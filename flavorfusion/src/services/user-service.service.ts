import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost/controller';

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_user_profile.php`,
       { withCredentials: true });
  }

  updateUserProfile(profile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_user_profile.php`, 
      profile, { withCredentials: true });
  }
}



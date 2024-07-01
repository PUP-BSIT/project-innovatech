import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_user_profile.php`,
       { withCredentials: true });
  }

  updateUserProfile(profile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_user_profile.php`, 
      profile, { withCredentials: true });
  }

  updateUserAvatar(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_user_avatar.php`, 
      formData, { withCredentials: true });
  }

}



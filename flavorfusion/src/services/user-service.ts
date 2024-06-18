import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost/controller';

  constructor(private http: HttpClient) { }

  // getUserProfile(): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.get<any>(`${this.apiUrl}/get_user_profile.php`,{ headers: headers, withCredentials: true });
  // }
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_user_profile.php`,
       { withCredentials: true });
  }

  // updateUserProfile(profileData: any): Observable<any> {
  //   console.log('Updating profile:', profileData); // Check if profileData is correct
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.post<any>(`${this.apiUrl}/update_user_profile.php`, profileData, { headers: headers, withCredentials: true });
  // }

  updateUserProfile(profile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_user_profile.php`, 
      profile, { withCredentials: true });
}

}

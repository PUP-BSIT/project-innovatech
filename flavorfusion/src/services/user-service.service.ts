import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable()
export class UserService {
  private apiUrl = environment.apiUrl;
  private userProfileSubject = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchUserProfile();
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_user_profile.php`, { withCredentials: true })
      .pipe(tap(profile => this.userProfileSubject.next(profile)));
  }

  updateUserProfile(profile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_user_profile.php`, profile, { withCredentials: true })
      .pipe(tap(() => this.fetchUserProfile()));
  }

  updateUserAvatar(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_user_avatar.php`, formData, { withCredentials: true })
      .pipe(tap(() => this.fetchUserProfile()));
  }

  fetchUserProfile() {
    this.getUserProfile().subscribe();
  }
}

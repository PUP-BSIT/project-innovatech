import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class LoginAuthentication {
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private sessionTimeout: number = 3600000;
  private username: string;
  private userAvatar: string;
  private apiURL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.isLoggedInSubject.next(true);
      this.resetSessionTimeout();
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  setIsLoggedIn(value: boolean): void {
    this.isLoggedInSubject.next(value);
  }

  setUserId(userId: string): void {
    localStorage.setItem('user_id', userId);
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  getUsername(): string {
    return this.username;
  }

  getUserAvatar(): string {
    return this.userAvatar;
  }

  private resetSessionTimeout(): void {
    setTimeout(() => {
      localStorage.removeItem('user_id');
      this.router.navigateByUrl('/login');
      this.isLoggedInSubject.next(false);
    }, this.sessionTimeout);
  }

  logout(): Observable<void> {
    localStorage.removeItem('user_id');
    this.isLoggedInSubject.next(false);
    return of(void 0);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user_id');
  }

  login(formData: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/login.php`, formData, { withCredentials: true });
  }
}
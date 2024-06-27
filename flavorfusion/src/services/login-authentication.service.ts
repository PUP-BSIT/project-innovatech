import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoginAuthentication {

  private isLoggedInSubject: BehaviorSubject<boolean> = 
      new BehaviorSubject<boolean>(false);

  public isLoggedIn$: Observable<boolean> = 
      this.isLoggedInSubject.asObservable();
      
  private sessionTimeout: number = 3600000; // 1 hr

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

  private resetSessionTimeout(): void {
    setTimeout(() => {
      localStorage.removeItem('user_id');
      this.router.navigateByUrl('/login');
      this.isLoggedInSubject.next(false);
    }, this.sessionTimeout);
  }

  logout(): void {
    localStorage.removeItem('user_id');
    this.isLoggedInSubject.next(false);
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user_id');
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoginAuthentication {

  private isLoggedInSubject: BehaviorSubject<boolean> = 
      new BehaviorSubject<boolean>(false);

  public isLoggedIn$: Observable<boolean> = 
      this.isLoggedInSubject.asObservable();
      
  private sessionTimeout: number = 3600000; // 1 hr

  constructor(private router: Router) {}

  checkAuthentication(): void {
    // TODO: implement login logout logic
    let isLoggedIn = true;
    this.isLoggedInSubject.next(isLoggedIn);

    if (isLoggedIn) {
      this.resetSessionTimeout();
    } 
  }

  setIsLoggedIn(value: boolean): void {
    this.isLoggedInSubject.next(value);
  }

  private resetSessionTimeout(): void {
   
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, this.sessionTimeout);
  }
}

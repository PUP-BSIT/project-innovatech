import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable()
export class ForgotPasswordService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  forgotPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/send_email.php`, 
          { email, type: 'forgot_password' }, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyUser(email: string, otp: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/send_email.php`, 
      { email, type: 'verify_user', otp }, { headers }) // Include OTP in the payload
      .pipe(
        catchError(this.handleError)
      );
  }

  resetPassword(key: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/reset_password.php`, 
      { key, email, password }, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}

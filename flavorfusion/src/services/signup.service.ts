import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class SignupService {
  private signupUrl = `${environment.apiUrl}/signup.php`;
  private storeOtpUrl = `${environment.apiUrl}/store_otp.php`;
  private verifyOtpUrl = `${environment.apiUrl}/verify_otp.php`;

  constructor(private http: HttpClient) {}

  signup(user: any): Observable<any> {
    return this.http.post(this.signupUrl, user);
  }

  storeOTP(email: string, otp: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('email', email);
    body.set('otp', otp);

    return this.http.post<any>(this.storeOtpUrl, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    });
  }

  verifyOTP(email: string, otp: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('email', email);
    body.set('otp', otp);

    return this.http.post<any>(this.verifyOtpUrl, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    });
  }
}

import { Component } from '@angular/core';
import { ForgotPasswordService } from '../../services/forgot-password.service'; 

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  email: string = '';

  constructor(private authService: ForgotPasswordService) { }

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe(
      response => {
        console.log('Email sent successfully', response);
        alert('Password reset link sent to your email');
      },
      error => {
        console.error('Error sending email', error);
        alert('There was an error sending the password reset link');
      }
    );
  }
}

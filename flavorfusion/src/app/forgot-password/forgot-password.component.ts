import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isLoading: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private authService: ForgotPasswordService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid || !this.isValidEmail(this.forgotPasswordForm.value.email)) {
      this.snackBar.open('Please enter a valid email address', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error'
      });
      return;
    }

    this.isLoading = true; 

    this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(
      response => {
        this.isLoading = false;
        console.log('Email sent successfully', response);
        this.snackBar.open('Password reset link sent to your email', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-success'
        });
      },
      error => {
        this.isLoading = false; 
        console.error('Error sending email', error);
        this.snackBar.open('There was an error sending the password reset link', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-error'
        });
      }
    );
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
}

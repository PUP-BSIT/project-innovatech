import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignupService } from '../../services/signup.service';
import { ForgotPasswordService } from '../../services/forgot-password.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup;
  verificationForm: FormGroup;
  passwordError = false;
  confirmPasswordError = false;
  showVerificationForm = false;
  email = '';
  otp = '';
  isLoading = false;
  otpError = false;
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    private forgotPasswordService: ForgotPasswordService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });

    this.verificationForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onBlurPassword() {
    const passwordControl = this.signupForm.get('password');
    this.passwordError = passwordControl?.errors && passwordControl?.touched;
  }

  onBlurConfirmPassword() {
    const confirmPasswordControl = this.signupForm.get('confirmPassword');
    this.confirmPasswordError = confirmPasswordControl?.errors || this.signupForm.errors?.mismatch;
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    this.email = this.signupForm.get('email')?.value;
    this.showVerificationForm = true;

    // Store OTP in the database
    this.storeOTP();
  }

  storeOTP() {
    this.otp = this.generateOTP();
    this.signupService.storeOTP(this.email, this.otp).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('OTP stored successfully.');
        } else {
          console.error('Failed to store OTP.');
        }
      },
      error: (error) => {
        console.error('Error storing OTP:', error);
      }
    });
  }

  generateOTP() {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  emailOTP() {
    this.isLoading = true;
    this.forgotPasswordService.verifyUser(this.email, this.otp).subscribe({
      next: (emailResponse) => {
        this.isLoading = false;
        if (emailResponse.status === 'success') {
          console.log('Verification email sent successfully.');
          this.snackBar.open('Verification email sent successfully', 'Close', {
            duration: 3000
          });
        } else {
          console.error('Failed to send verification email.');
          this.snackBar.open('Failed to send verification email', 'Close', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error sending verification email:', error);
      }
    });
  }

  onVerify() {
    if (this.verificationForm.invalid) {
      return;
    }

    this.isLoading = true;
    const enteredOTP = this.verificationForm.get('otp')?.value;

    this.signupService.verifyOTP(this.email, enteredOTP).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          console.log('OTP verified successfully.');
          this.showModal = true;
        } else {
          console.error('Invalid OTP.');
          this.otpError = true;
          this.snackBar.open('Invalid OTP', 'Close', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error verifying OTP:', error);
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.router.navigate(['/login']);
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  passwordError: boolean = false;
  confirmPasswordError: boolean = false;
  showVerificationForm: boolean = false;
  email: string = '';
  otp: string = '';

  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    private forgotPasswordService: ForgotPasswordService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });

    this.verificationForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), 
        Validators.maxLength(6)]]
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
    this.confirmPasswordError = confirmPasswordControl?.errors || 
        this.signupForm.errors?.mismatch;
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
    this.forgotPasswordService.verifyUser(this.email, this.otp).subscribe({
      next: (emailResponse) => {
        if (emailResponse.status === 'success') {
          console.log('Verification email sent successfully.');
        } else {
          console.error('Failed to send verification email.');
        }
      },
      error: (error) => {
        console.error('Error sending verification email:', error);
      }
    });
  }

  onVerify() {
    const enteredOTP = this.verificationForm.get('otp')?.value;
    if (enteredOTP === this.otp) {
      console.log('OTP verified successfully.');

      // Proceed with user signup
      this.completeSignup();
    } else {
      console.error('Invalid OTP.');
      // Handle invalid OTP scenario
    }
  }

  completeSignup() {
    const user = {
      email: this.signupForm.get('email').value,
      password: this.signupForm.get('password').value
    };

    this.signupService.signup(user).subscribe({
      next: (response) => {
        console.log('Signup response:', response);
        if (response.success) {
          this.router.navigate(['/login']);
        } else {
          console.error('Signup failed:', response.message);       
        }
      },
      error: (err) => {
        console.error('Signup error:', err);
        
      }
    });
  }
}

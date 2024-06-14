import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup;
  passwordError: boolean = false;
  confirmPasswordError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  onBlurPassword() {
    const passwordControl = this.signupForm.get('password');
    if (passwordControl.errors && passwordControl.touched) {
      this.passwordError = true;
    } else {
      this.passwordError = false;
    }
  }

  onBlurConfirmPassword() {
    const confirmPasswordControl = this.signupForm.get('confirmPassword');
    if (confirmPasswordControl.errors || this.signupForm.errors?.mismatch) {
      this.confirmPasswordError = true;
    } else {
      this.confirmPasswordError = false;
    }
  }

  onSubmit() { // TODO: add front end message for successful acct creation    
    if (this.signupForm.invalid) {
      return;
    }
  
    const user = {
      email: this.signupForm.get('email').value,
      password: this.signupForm.get('password').value
    };
  
    this.signupService.signup(user).subscribe(response => {
      console.log('Signup response:', response);
      // Handle success, redirect to login page
      this.router.navigate(['/login']);
    }, error => {
      console.error('Signup error:', error);
      // Handle error
    });
  }
  
}

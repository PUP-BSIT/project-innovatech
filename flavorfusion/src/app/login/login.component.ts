import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginAuthentication } from '../../services/login-authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoggedIn$: Observable<boolean>;
  showModal = false;

  constructor(
    private router: Router,
    private loginAuthService: LoginAuthentication,
    private formBuilder: FormBuilder
  ) {
    this.isLoggedIn$ = this.loginAuthService.isLoggedIn$;

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators
            .maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.loginAuthService.login(formData).subscribe(
        response => {
          if (response.success) {
            this.loginAuthService.setIsLoggedIn(true);
            this.loginAuthService.setUserId(response.user_id);
            this.showModal = true;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Email or password is incorrect.';
          }
        },
        error => {
          console.error('Error:', error);
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      );
    } else {
      this.errorMessage = 'Please enter valid email and password.';
    }
  }

  closeModal(): void {
    this.loginForm.reset();
    this.errorMessage = '';
    this.showModal = false;
    this.router.navigate(['/profile']);
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}

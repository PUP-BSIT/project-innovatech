import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordService } from '../../services/forgot-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  email: string | null = null;
  resetForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: ForgotPasswordService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      console.log(`Token: ${this.token}, Email: ${this.email}`); // Debugging line
      if (!this.token || !this.email) {
        console.error('Token or email missing');
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  passwordMatchValidator(formGroup: FormGroup): { [s: string]: boolean } | null {
    if (formGroup.get('password')?.value !== formGroup.get('confirmPassword')?.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit() {
    if (this.resetForm.valid && this.token && this.email) {
      const newPassword = this.resetForm.get('password')?.value;
      this.authService.resetPassword(this.token, this.email, newPassword).subscribe(response => {
        console.log(response);
        this.router.navigate(['/login']);
      }, error => {
        console.error('Error resetting password', error);
      });
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow border-0">
            <div class="card-body p-5">
              <h2 class="text-center mb-4 fw-bold">Login</h2>
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-control rounded-pill" formControlName="email">
                </div>
                <div class="mb-4">
                  <label class="form-label">Password</label>
                  <input type="password" class="form-control rounded-pill" formControlName="password">
                </div>
                <button type="submit" class="btn btn-primary w-100 rounded-pill py-2 fw-bold" [disabled]="loginForm.invalid">
                  Login Now
                </button>
              </form>
              <div class="text-center mt-4 text-muted small">
                Don't have an account? <a routerLink="/register" class="text-decoration-none fw-bold">Register here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
          setTimeout(() => window.location.reload(), 100); // Trigger navbar update
        },
        error: (err) => alert('Login failed: ' + err.message)
      });
    }
  }
}

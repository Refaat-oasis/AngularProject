import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow border-0">
            <div class="card-body p-5">
              <h2 class="text-center mb-4 fw-bold">Create Account</h2>
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control rounded-pill" formControlName="name">
                </div>
                <div class="mb-3">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-control rounded-pill" formControlName="email">
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input type="password" class="form-control rounded-pill" formControlName="password">
                </div>
                <div class="mb-4">
                  <label class="form-label">I am a...</label>
                  <select class="form-select rounded-pill" formControlName="role">
                    <option value="Customer">Shop as Customer</option>
                    <option value="Seller">Earn as Seller</option>
                    <option value="Admin">Platform Administrator</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary w-100 rounded-pill py-2 fw-bold" [disabled]="registerForm.invalid">
                  Register Account
                </button>
              </form>
              <div class="text-center mt-4 text-muted small">
                Already have an account? <a routerLink="/login" class="text-decoration-none fw-bold">Login here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Customer', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (err) => alert('Registration failed: ' + err.message)
      });
    }
  }
}

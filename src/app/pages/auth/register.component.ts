import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container d-flex align-items-center justify-content-center py-5">
      <div class="auth-card p-5 merchant-card max-w-xl w-100 position-relative z-1">
        <div class="text-center mb-5">
          <h2 class="h3 fw-bold mb-2">Create Account</h2>
          <p class="text-secondary small">Join the elite network of artisans and curators</p>
        </div>

        <form (ngSubmit)="onRegister()" #regForm="ngForm">
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <label class="form-label text-secondary small fw-bold uppercase ls-wider mb-2">Full Name</label>
<input type="text"  class="form-control merchant-input"  [class.is-invalid]="name.invalid && name.touched" name="name" #name="ngModel" [(ngModel)]="user.name"
   required minlength="3" pattern="^[a-zA-Z ]+$" placeholder="John Doe">
    @if (name.touched && name.invalid) {
                <div class="invalid-feedback">
                  @if (name.errors?.['required']) {
                    <div>Full name is required.</div>
                  }
                  @if (name.errors?.['minlength']) {
                    <div>Name must be at least 3 characters.</div>
                  }
                  @if (name.errors?.['pattern']) {
                    <div>Only letters and spaces are allowed.</div>
                  }
                </div>
              }
                 
                         </div>
            <div class="col-md-6">
              <label class="form-label text-secondary small fw-bold uppercase ls-wider mb-2">Email Address</label>
<input type="email" class="form-control merchant-input" [class.is-invalid]="email.invalid && email.touched" name="email"  #email="ngModel" [(ngModel)]="user.email"
                required
                email
                placeholder="name@company.com">   
                @if (email.touched && email.invalid) {
                <div class="invalid-feedback">
                  @if (email.errors?.['required']) {
                    <div>Email is required.</div>
                  }
                  @if (email.errors?.['email']) {
                    <div>Please enter a valid email address.</div>
                  }
                </div>
              }      
                 </div>
             <div class="col-md-6">
              <label class="form-label text-secondary small fw-bold uppercase ls-wider mb-2">Address</label>
<input
                type="text"
                class="form-control merchant-input"
                [class.is-invalid]="address.invalid && address.touched"
                name="address"
                #address="ngModel"
                [(ngModel)]="user.address"
                required
                minlength="5"
                placeholder="123 Main St">
                   @if (address.touched && address.invalid) {
                <div class="invalid-feedback">
                  @if (address.errors?.['required']) {
                    <div>Address is required.</div>
                  }
                  @if (address.errors?.['minlength']) {
                    <div>Address must be at least 5 characters.</div>
                  }
                </div>
              }
              
              </div>
          </div>

          <div class="mb-4">
            <label class="form-label text-secondary small fw-bold uppercase ls-wider mb-3">I want to join as a:</label>
            <div class="row g-3">
              <div class="col-6">
                <div class="role-card p-3 text-center cursor-pointer border rounded-3 transition-all"
                     [class.active]="user.role === 'User'"
                     (click)="user.role = 'User'">
                  <span class="material-symbols-outlined mb-2 fs-2">shopping_bag</span>
                  <div class="fw-bold small">Customer</div>
                  <div class="text-secondary-variant x-small">Browse & Buy</div>
                </div>
              </div>
              <div class="col-6">
                <div class="role-card p-3 text-center cursor-pointer border rounded-3 transition-all"
                     [class.active]="user.role === 'Seller'"
                     (click)="user.role = 'Seller'">
                  <span class="material-symbols-outlined mb-2 fs-2">storefront</span>
                  <div class="fw-bold small">Seller</div>
                  <div class="text-secondary-variant x-small">Curation & Sales</div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-5">
            <label class="form-label text-secondary small fw-bold uppercase ls-wider mb-2">Password</label>
<input
              type="password"
              class="form-control merchant-input"
              [class.is-invalid]="password.invalid && password.touched"
              name="password"
              #password="ngModel"
              [(ngModel)]="user.password"
              required
              minlength="6"
              placeholder="••••••••">       
             @if (password.touched && password.invalid) {
              <div class="invalid-feedback">
                @if (password.errors?.['required']) {
                  <div>Password is required.</div>
                }
                @if (password.errors?.['minlength']) {
                  <div>Password must be at least 6 characters.</div>
                }
                @if (password.errors?.['pattern']) {
                  <div>
                    Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.
                  </div>
                }
              </div>
            }
            
            </div>

          <button type="submit" class="btn btn-primary-merchant w-100 py-3 mb-4" [disabled]="!regForm.form.valid">
            Create Account
          </button>

          <p class="text-center small text-secondary mb-0">
            Already have an account?
            <a routerLink="/login" class="text-primary fw-bold text-decoration-none hover-secondary">Sign In</a>
          </p>
        </form>
      </div>

      <!-- Decorative Background -->
      <div class="absolute-fill z-0 opacity-5">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuApvu3N6znghCVmlY_mIms9CkY20UDAZ2dw9KO9lTxedRX9qfuN2Ec1d2LNBMIMYdX-h6zw-QZjWYNJTdWK6PsnODjW317GbDUY2bcrJi323Z02ELhD4o33M1cDG9jUgKRmwUrTIzqAcob1y1xNLmissd9iNqN_D1fRfmT0dFLuQnqfIpdOWvoFqIbylJBXqbokAq6viBL-SZG5y4EaAMbHoLaLhKWXHFodbne6J9p_ffQV1Qk5F5JEGtve_zH09CH8Obd0t3MDsiA"
             class="w-100 h-100 object-fit-cover" alt="Background">
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 100vh; background-color: var(--background); position: relative; }
    .auth-card { z-index: 1; border: 1px solid rgba(0,0,0,0.05); }
    .max-w-xl { max-width: 600px; }
    .ls-wider { letter-spacing: 0.05em; }
    .merchant-input {
      background-color: var(--surface-container-low);
      border: 1px solid transparent;
      padding: 0.75rem 1rem;
      border-radius: 8px;
    }
    .merchant-input:focus {
      background-color: white;
      border-color: var(--secondary);
      box-shadow: none;
    }
    .role-card { background: white; border-color: rgba(0,0,0,0.05) !important; }
    .role-card:hover { border-color: var(--secondary) !important; background: var(--surface-container-low); }
    .role-card.active { border-color: var(--secondary) !important; background: var(--secondary-container); color: var(--on-secondary-container); box-shadow: 0 4px 12px rgba(0, 99, 151, 0.1); }
    .x-small { font-size: 0.65rem; }
    .text-secondary-variant { color: var(--on-surface-variant); }
    .absolute-fill { position: absolute; inset: 0; }
  `]
})
export class RegisterComponent {
  user = { name: '', email: '', password: '', address: '', role: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.error('Registration failed', err);
        alert('Registration failed. Please check your input and try again.');
      }
    });
  }
}
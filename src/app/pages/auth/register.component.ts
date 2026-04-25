import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
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
      <div class="auth-bg-glow glow-1"></div>
      <div class="auth-bg-glow glow-2"></div>

      <div class="auth-card p-5 w-100 position-relative z-1">
        <div class="text-center mb-5">
          <div class="brand-icon mx-auto mb-3">
            <span class="material-symbols-outlined" style="font-size: 32px; font-variation-settings: 'FILL' 1;">person_add</span>
          </div>
          <h2 class="h3 fw-bold mb-2">Create Account</h2>
          <p class="subtitle small mb-0">Join the NEXUS network of artisans and curators</p>
        </div>

        <form (ngSubmit)="onRegister()" #regForm="ngForm">
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <label class="form-label label-text small fw-bold mb-2">FULL NAME</label>
              <div class="input-wrap">
                <span class="material-symbols-outlined input-icon">person</span>
                <input type="text"
                  class="form-control auth-input"
                  [class.is-invalid]="name.invalid && name.touched"
                  name="name" #name="ngModel" [(ngModel)]="user.name"
                  required minlength="3" pattern="^[a-zA-Z ]+$"
                  placeholder="John Doe">
              </div>
              @if (name.touched && name.invalid) {
                <div class="error-text mt-2">
                  @if (name.errors?.['required']) { <span>Full name is required.</span> }
                  @if (name.errors?.['minlength']) { <span>Name must be at least 3 characters.</span> }
                  @if (name.errors?.['pattern']) { <span>Only letters and spaces are allowed.</span> }
                </div>
              }
            </div>
            <div class="col-md-6">
              <label class="form-label label-text small fw-bold mb-2">EMAIL ADDRESS</label>
              <div class="input-wrap">
                <span class="material-symbols-outlined input-icon">mail</span>
                <input type="email"
                  class="form-control auth-input"
                  [class.is-invalid]="email.invalid && email.touched"
                  name="email" #email="ngModel" [(ngModel)]="user.email"
                  required email
                  placeholder="name@company.com">
              </div>
              @if (email.touched && email.invalid) {
                <div class="error-text mt-2">
                  @if (email.errors?.['required']) { <span>Email is required.</span> }
                  @if (email.errors?.['email']) { <span>Please enter a valid email address.</span> }
                </div>
              }
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label label-text small fw-bold mb-2">ADDRESS</label>
            <div class="input-wrap">
              <span class="material-symbols-outlined input-icon" style="top: 22px; transform: none;">location_on</span>
              <textarea
                class="form-control auth-input auth-textarea"
                [class.is-invalid]="address.invalid && address.touched"
                name="address" #address="ngModel" [(ngModel)]="user.address"
                required minlength="5" rows="2"
                placeholder="123 Main St, City, Country"></textarea>
            </div>
            @if (address.touched && address.invalid) {
              <div class="error-text mt-2">
                @if (address.errors?.['required']) { <span>Address is required.</span> }
                @if (address.errors?.['minlength']) { <span>Address must be at least 5 characters.</span> }
              </div>
            }
          </div>

          <div class="mb-4">
            <fieldset>
              <legend class="form-label label-text small fw-bold mb-3">I WANT TO JOIN AS</legend>
              <div class="row g-3">
                <div class="col-6">
                  <label class="role-card p-3 text-center d-block"
                    [class.active]="user.role === 'User'">
                    <input type="radio" class="visually-hidden" name="role" [(ngModel)]="user.role" value="User" required>
                    <span class="material-symbols-outlined mb-2 fs-2">shopping_bag</span>
                    <div class="fw-bold small">Customer</div>
                    <div class="role-sub x-small">Browse & Buy</div>
                  </label>
                </div>
                <div class="col-6">
                  <label class="role-card p-3 text-center d-block"
                    [class.active]="user.role === 'Seller'">
                    <input type="radio" class="visually-hidden" name="role" [(ngModel)]="user.role" value="Seller" required>
                    <span class="material-symbols-outlined mb-2 fs-2">storefront</span>
                    <div class="fw-bold small">Seller</div>
                    <div class="role-sub x-small">Curation & Sales</div>
                  </label>
                </div>
              </div>
            </fieldset>
            @if (!user.role && regForm.submitted) {
              <div class="error-text mt-2">Please choose whether you are joining as a customer or seller.</div>
            }
          </div>

          <div class="mb-4">
            <label class="form-label label-text small fw-bold mb-2">PASSWORD</label>
            <div class="input-wrap">
              <span class="material-symbols-outlined input-icon">lock</span>
              <input type="password"
                class="form-control auth-input auth-input-padded"
                [class.is-invalid]="password.invalid && password.touched"
                name="password" #password="ngModel" [(ngModel)]="user.password"
                required minlength="6"
                [type]="showPassword ? 'text' : 'password'"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@@$!%*?&])[A-Za-z\\d@@$!%*?&]{6,}$"
                placeholder="••••••••">
              <button type="button" class="toggle-pw-btn" (click)="showPassword = !showPassword" tabindex="-1" aria-label="Toggle password visibility">
                <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            @if (password.touched && password.invalid) {
              <div class="error-text mt-2">
                @if (password.errors?.['required']) { <span>Password is required.</span> }
                @if (password.errors?.['minlength']) { <span>Password must be at least 6 characters.</span> }
                @if (password.errors?.['pattern']) {
                  <span>Must contain uppercase, lowercase, number, and special character.</span>
                }
              </div>
            }
          </div>

          @if (errorMessage) {
            <div class="error-banner mb-3">
              <span class="material-symbols-outlined me-2" style="font-size: 18px;">error</span>
              {{ errorMessage }}
            </div>
          }

          <button type="submit" class="btn btn-auth-primary w-100 py-3 mb-4" [disabled]="!regForm.form.valid">
            <span class="me-2">Create Account</span>
            <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
          </button>

          <p class="text-center small subtitle mb-0">
            Already have an account?
            <a routerLink="/login" class="link-text fw-bold text-decoration-none">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      background: var(--background);
      position: relative;
      overflow: hidden;
    }
    .auth-bg-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.12;
      pointer-events: none;
    }
    .glow-1 {
      width: 600px; height: 600px;
      background: var(--secondary);
      top: -200px; right: -200px;
    }
    .glow-2 {
      width: 500px; height: 500px;
      background: var(--primary);
      bottom: -150px; left: -150px;
    }
    .auth-card {
      max-width: 600px;
      z-index: 1;
      border-radius: 20px;
      background: var(--surface);
      border: 1px solid var(--outline-variant);
      box-shadow: var(--shadow-elevated);
    }
    .brand-icon {
      width: 56px; height: 56px;
      border-radius: 16px;
      background: var(--primary);
      color: var(--background);
      display: flex; align-items: center; justify-content: center;
    }
    h2 { color: var(--on-surface); }
    .subtitle { color: var(--on-surface-variant); }
    .label-text { color: var(--on-surface-variant); letter-spacing: 0.08em; }
    .input-wrap { position: relative; }
    .input-icon {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      font-size: 20px; color: var(--on-surface-variant); pointer-events: none; z-index: 1;
    }
    .toggle-pw-btn {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; padding: 0; cursor: pointer;
      color: var(--on-surface-variant); z-index: 2;
      display: flex; align-items: center;
      transition: color 0.2s;
    }
    .toggle-pw-btn:hover { color: var(--on-surface); }
    .toggle-pw-btn .material-symbols-outlined { font-size: 20px; }
    .auth-input {
      padding-left: 44px !important;
    }
    .auth-input-padded {
      padding-right: 44px !important;
      background: var(--surface-container-low) !important;
      border: 1px solid var(--outline-variant) !important;
      border-radius: 12px !important;
      color: var(--on-surface) !important;
      font-size: 0.925rem;
      transition: var(--transition-smooth);
    }
    .auth-textarea { padding-top: 12px !important; }
    .auth-input::placeholder { color: var(--on-surface-variant); opacity: 0.5; }
    .auth-input:focus {
      background: var(--surface) !important;
      border-color: var(--secondary) !important;
      box-shadow: 0 0 0 4px rgba(0, 99, 151, 0.15) !important;
    }
    .auth-input.is-invalid {
      border-color: var(--error) !important;
      box-shadow: 0 0 0 4px rgba(186, 26, 26, 0.1) !important;
    }
    .error-text { color: var(--error); font-size: 0.8rem; }
    .error-banner {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      background: var(--error-container);
      color: var(--on-error-container);
      font-size: 0.875rem;
    }
    .link-text { color: var(--secondary); transition: var(--transition-smooth); }
    .link-text:hover { color: var(--primary); }
    .role-card {
      cursor: pointer;
      border-radius: 14px;
      border: 1px solid var(--outline-variant);
      background: var(--surface-container-low);
      color: var(--on-surface);
      transition: var(--transition-smooth);
    }
    .role-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-elevated);
      background: var(--surface);
    }
    .role-card.active {
      background: var(--primary);
      color: var(--background);
      border-color: var(--primary);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    .role-card.active .role-sub { color: var(--on-surface-variant); opacity: 0.8; }
    .role-sub { color: var(--on-surface-variant); transition: var(--transition-smooth); }
    .x-small { font-size: 0.65rem; }
    .btn-auth-primary {
      background: var(--primary);
      color: var(--background);
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-smooth);
    }
    .btn-auth-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      background: var(--primary-container);
      color: var(--on-surface);
    }
    .btn-auth-primary:disabled {
      opacity: 0.5;
      transform: none;
      box-shadow: none;
    }
  `]
})
export class RegisterComponent {
  user = { name: '', email: '', password: '', address: '', role: 'User' };
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  onRegister() {
    this.errorMessage = '';

    this.authService.register(this.user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        if (err.status === 400) {
          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'This email is already registered.';
          }
        } else {
          this.errorMessage = 'Something went wrong. Please try again later.';
        }
        this.zone.run(() => {
          this.cdr.detectChanges();
        });
      }
    });
  }
}

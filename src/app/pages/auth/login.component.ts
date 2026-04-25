import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container d-flex align-items-center justify-content-center">
      <!-- Ambient background glow -->
      <div class="auth-bg-glow glow-1"></div>
      <div class="auth-bg-glow glow-2"></div>

      <div class="auth-card p-5 w-100 position-relative z-1">
        <!-- Brand mark -->
        <div class="text-center mb-5">
          <div class="brand-icon mx-auto mb-3">
            <span class="material-symbols-outlined" style="font-size: 32px; font-variation-settings: 'FILL' 1;">shopping_bag</span>
          </div>
          <h2 class="h3 fw-bold mb-2">Welcome Back</h2>
          <p class="subtitle small mb-0">Sign in to your NEXUS account</p>
        </div>

        <form (ngSubmit)="onLogin(loginForm)" #loginForm="ngForm">
          <div class="mb-4">
            <label class="form-label label-text small fw-bold mb-2">EMAIL ADDRESS</label>
            <div class="input-wrap">
              <span class="material-symbols-outlined input-icon">mail</span>
              <input
                type="email"
                class="form-control auth-input"
                [class.is-invalid]="(email.invalid && loginForm.submitted) || emailNotFound"
                name="email"
                #email="ngModel"
                [(ngModel)]="credentials.email"
                required
                email
                placeholder="name@company.com"
                (input)="clearErrors()">
            </div>
            @if (loginForm.submitted && email.invalid) {
              <div class="error-text mt-2">
                @if (email.errors?.['required']) { <span>Email is required.</span> }
                @if (email.errors?.['email']) { <span>Invalid email format.</span> }
              </div>
            }
            @if (emailNotFound) {
              <div class="error-text mt-2">This email is not registered.</div>
            }
          </div>

          <div class="mb-4">
            <label class="form-label label-text small fw-bold mb-2">PASSWORD</label>
            <div class="input-wrap">
              <span class="material-symbols-outlined input-icon">lock</span>
              <input
                [type]="showPassword ? 'text' : 'password'"
                class="form-control auth-input auth-input-padded"
                [class.is-invalid]="(password.invalid && loginForm.submitted) || wrongPassword"
                name="password"
                #password="ngModel"
                [(ngModel)]="credentials.password"
                required
                placeholder="••••••••"
                (input)="clearErrors()">
              <button type="button" class="toggle-pw-btn" (click)="showPassword = !showPassword" tabindex="-1" aria-label="Toggle password visibility">
                <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            @if (loginForm.submitted && password.invalid) {
              <div class="error-text mt-2">
                @if (password.errors?.['required']) { <span>Password is required.</span> }
              </div>
            }
            @if (wrongPassword) {
              <div class="error-text mt-2">Incorrect password.</div>
            }
          </div>

          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="remember" name="rememberMe" [(ngModel)]="credentials.rememberMe">
              <label class="form-check-label small subtitle" for="remember">Remember me</label>
            </div>
            <a routerLink="/forgot-password" class="small link-text text-decoration-none">Forgot password?</a>
          </div>

          <button type="submit" class="btn btn-auth-primary w-100 py-3 mb-4">
            <span class="me-2">Sign In</span>
            <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
          </button>

          <p class="text-center small subtitle mb-0">
            Don't have an account?
            <a routerLink="/register" class="link-text fw-bold text-decoration-none">Create one</a>
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
      top: -200px; left: -200px;
    }
    .glow-2 {
      width: 500px; height: 500px;
      background: var(--primary);
      bottom: -150px; right: -150px;
    }
    .auth-card {
      max-width: 440px;
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
    .label-text {
      color: var(--on-surface-variant);
      letter-spacing: 0.08em;
    }
    .input-wrap {
      position: relative;
    }
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
    .error-text {
      color: var(--error);
      font-size: 0.8rem;
    }
    .link-text {
      color: var(--secondary);
      transition: var(--transition-smooth);
    }
    .link-text:hover { color: var(--primary); }
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
    .form-check-input {
      border: 1px solid var(--outline-variant) !important;
      box-shadow: none !important;
      padding: 0 !important;
    }
    .form-check-input:checked {
      background-color: var(--secondary) !important;
      border-color: var(--secondary) !important;
    }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '', rememberMe: false };
  emailNotFound = false;
  wrongPassword = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  clearErrors() {
    this.emailNotFound = false;
    this.wrongPassword = false;
  }

  onLogin(form: NgForm) {
    this.clearErrors();
    form.form.markAllAsTouched();
    if (form.invalid) return;

    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        const token = res.token?.result || res.token || res.result || res?.token || res;
        if (token && typeof token === 'string') {
          localStorage.setItem('token', token);
          let decoded: any;
          try { decoded = jwtDecode(token); } catch (e) {}

          const userRole = this.authService.getUserRole();
          const rolesArray = Array.isArray(userRole) ? userRole : [userRole];

          if (rolesArray.includes('Seller')) {
            this.router.navigate(['/seller/products']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        const mess = err.error?.message?.toLowerCase().trim() || '';
        this.zone.run(() => {
          this.emailNotFound = mess.includes('email');
          this.wrongPassword = mess.includes('password');
          this.cdr.detectChanges();
        });
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container d-flex align-items-center justify-content-center">
      <div class="auth-card p-5 merchant-card max-w-md w-100 position-relative z-1">
        <div class="text-center mb-5">
          <h2 class="h3 fw-bold mb-2">Welcome Back</h2>
          <p class="text-secondary small">Sign in to your Merchant account</p>
        </div>
        
        <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="space-y-4">
          <div class="mb-4">
            <label class="form-label text-secondary small fw-bold uppercase ls-wider mb-2">Email Address</label>
            <input type="email" class="form-control merchant-input" name="email" [(ngModel)]="credentials.email" required placeholder="name@company.com">
          </div>
          
          <div class="mb-4">
            <label class="form-label text-secondary small fw-bold uppercase ls-wider mb-2">Password</label>
            <input type="password" class="form-control merchant-input" name="password" [(ngModel)]="credentials.password" required placeholder="••••••••">
          </div>
          
          <div class="d-flex justify-content-between align-items-center mb-5">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="remember">
              <label class="form-check-label small text-secondary" for="remember">Remember me</label>
            </div>
            <a href="#" class="small text-secondary text-decoration-none hover-primary">Forgot password?</a>
          </div>
          
          <button type="submit" class="btn btn-primary-merchant w-100 py-3 mb-4" [disabled]="!loginForm.form.valid">
            Sign In
          </button>
          
          <p class="text-center small text-secondary mb-0">
            Don't have an account? 
            <a routerLink="/register" class="text-primary fw-bold text-decoration-none hover-secondary">Create one</a>
          </p>
        </form>
      </div>
      
      <!-- Decorative Background -->
      <div class="absolute-fill z-0 opacity-5">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBg8eznBxWEst4fedRGoMHxIBmaMutdvTaHqRDItwCyfFP5t-FFAB29qcMhg1E_GT68Z6ZhKPAkqNYCrc5GExszF8uRsxxh4usyG-hIeN8bsbIo7cokNQ9kdVIeUTByxfIIlRwtbg_hXhK4toV2UEWCcAk4v5cknbMhqVXCLmSV8A75LgzlW42jRNfS2MDxrYHjO-OhD3zkbR03yCUAaLJzlsZX6wqczQIV_rFTZi2L8H8yMAIQSt6tQDfRLhXtOlV17KYcBVVVFE" 
             class="w-100 h-100 object-fit-cover" alt="Background">
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 100vh; background-color: var(--background); position: relative; }
    .auth-card { z-index: 1; border: 1px solid rgba(0,0,0,0.05); }
    .max-w-md { max-width: 450px; }
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
    .hover-primary:hover { color: var(--primary) !important; }
    .hover-secondary:hover { color: var(--secondary) !important; }
    .absolute-fill { position: absolute; inset: 0; }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.credentials).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}

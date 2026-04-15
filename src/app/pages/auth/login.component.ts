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
      <div class="auth-card p-5 merchant-card max-w-md w-100 position-relative z-1">
        <div class="text-center mb-5">
          <h2 class="h3 fw-bold mb-2">Welcome Back</h2>
          <p class="text-secondary small">Sign in to your Merchant account</p>
        </div>

        <form (ngSubmit)="onLogin(loginForm)" #loginForm="ngForm" class="space-y-4">
          <div class="mb-4">
            <label class="form-label text-secondary small fw-bold uppercase ls-wider mb-2">Email Address</label>
 <input 
  type="email"
  class="form-control merchant-input"
[class.is-invalid]="(email.invalid && ( loginForm.submitted)) || emailNotFound"
  name="email"
  #email="ngModel"
  [(ngModel)]="credentials.email"
  required
  email
  placeholder="name@company.com"
  (input)="clearErrors()">
              @if ((loginForm.submitted) && email.invalid) {
  <div class="invalid-feedback d-block">
    @if (email.errors?.['required']) {
      <div>Email is required.</div>
    }
    @if (email.errors?.['email']) {
      <div>Invalid email format.</div>
    }
  </div>
}
  
  @if (emailNotFound) {
              <div class="invalid-feedback d-block">
                This email is not registered.
              </div>
            }
            </div>

          <div class="mb-4">
            <label class="form-label text-secondary small fw-bold uppercase ls-wider mb-2">Password</label>
<input
  type="password"
  class="form-control merchant-input"
[class.is-invalid]="(password.invalid && (loginForm.submitted)) || wrongPassword"
  name="password"
  #password="ngModel"
  [(ngModel)]="credentials.password"
  required
  placeholder="••••••••"
  (input)="clearErrors()">

@if ((loginForm.submitted) && password.invalid) {
  <div class="invalid-feedback d-block">
    @if (password.errors?.['required']) {
      <div>Password is required.</div>
    }
  </div>
}

@if (wrongPassword) {

  <div class="invalid-feedback d-block">
    Incorrect password.
  </div>
}

            </div>

          <div class="d-flex justify-content-between align-items-center mb-5">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="remember"   name="rememberMe" [(ngModel)]="credentials.rememberMe">
              <label class="form-check-label small text-secondary" for="remember" >Remember me</label>
            </div>
            <a routerLink="/forgot-password" class="small text-secondary text-decoration-none hover-primary">Forgot password?</a>
          </div>

          <button type="submit" class="btn btn-primary-merchant w-100 py-3 mb-4" >
            Sign In
          </button>

          <p class="text-center small text-secondary mb-0">
            Don't have an account?
            <a routerLink="/register" class="text-primary fw-bold text-decoration-none hover-secondary">Create one</a>
          </p>
        </form>
      </div>
    
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
  
credentials = { email: '', password: '', rememberMe: false };
  emailNotFound = false;
  wrongPassword = false;
  constructor(private authService: AuthService, private router: Router,private cdr: ChangeDetectorRef,
  private zone: NgZone) { }
  clearErrors() {
    this.emailNotFound = false;
    this.wrongPassword = false;
  }

 


//aya
// onLogin() {
//   this.authService.login(this.credentials).subscribe((res) => {

//     const token = res.token.result;
//     localStorage.setItem('token', token);

//     const decoded: any = jwtDecode(token);

//     const role = decoded.role;

//     if (role === 'Seller') {
//       this.router.navigate(['/seller/products']);
//     } else {
//       this.router.navigate(['/']); 
//     }

//   });
// }
//basant
// onLogin(form: NgForm) {

//   this.clearErrors();
//   form.form.markAllAsTouched();

// if (form.invalid) return;
//   localStorage.removeItem("token");
//   sessionStorage.removeItem("token");
//   this.authService.login(this.credentials).subscribe({
//  next: (res: any) => {

  
//           this.router.navigate(['/']);
//     },

//     error: (err) => {
//       const mess = err.error?.message?.toLowerCase().trim() || '';

//   this.zone.run(() => {
//     this.emailNotFound = mess.includes('email');
//     this.wrongPassword = mess.includes('password');

//     this.cdr.detectChanges();
//   });
     
//     }
//   });
// }

onLogin(form: NgForm) {

  this.clearErrors();
  form.form.markAllAsTouched();

  if (form.invalid) return;

  localStorage.removeItem("token");
  sessionStorage.removeItem("token");

  this.authService.login(this.credentials).subscribe({
    next: (res: any) => {

    
      const token = res.token?.result;
      if (token) {
        localStorage.setItem('token', token);

        const decoded: any = jwtDecode(token);
        const role = decoded.role;

      
        if (role === 'Seller') {
          this.router.navigate(['/seller/products']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        // fallback لو مفيش توكن
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

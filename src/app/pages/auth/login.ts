import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
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
          try {
            jwtDecode(token);
          } catch {}

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

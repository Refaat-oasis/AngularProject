import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
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

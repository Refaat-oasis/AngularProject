import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.html'
})
export class ForgotPasswordComponent {
  form: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.submitted = true;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Something went wrong. Please check your email and try again.';
        this.loading = false;
      }
    });
  }
}

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-reset-password',
//   imports: [],
//   templateUrl: './reset-password.html',
//   styleUrl: './reset-password.css',
// })
// export class ResetPassword {}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.html'
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  success = false;
  error = '';
  token = '';
  email = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

ngOnInit() {
  this.email = this.route.snapshot.queryParams['email'];
  this.token = this.route.snapshot.queryParams['token'];

  console.log('Email:', this.email);
  console.log('Token:', this.token);
}

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

 onSubmit() {
  if (this.form.invalid) return;

  this.loading = true;

  const data = {
    email: this.email,
    token: this.token, // token is already decoded by Angular ✅
    newPassword: this.form.value.password,
    confirmPassword: this.form.value.confirmPassword
  };

  this.authService.resetPassword(data).subscribe({
    next: () => {
      this.success = true;
      this.loading = false;
      setTimeout(() => this.router.navigate(['/login']), 3000);
    },
    error: (err) => {
      this.error = 'Something went wrong. Please try again.';
      this.loading = false;
    }
  });
}
}

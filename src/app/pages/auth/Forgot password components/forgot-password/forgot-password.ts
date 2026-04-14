// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-forgot-password',
//   imports: [],
//   templateUrl: './forgot-password.html',
//   styleUrl: './forgot-password.css',
// })
// export class ForgotPassword {}
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

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.submitted = true;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

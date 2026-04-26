import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService, AccountProfile, ChangePasswordPayload, UpdateAccountProfilePayload } from '../../services/auth.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettingsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly loadingProfile = signal(true);
  readonly savingProfile = signal(false);
  readonly changingPassword = signal(false);
  readonly profileMessage = signal('');
  readonly profileError = signal('');
  readonly passwordMessage = signal('');
  readonly passwordError = signal('');

  readonly profileForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
  });

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmNewPassword: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loadingProfile.set(true);
    this.profileError.set('');

    this.authService.getProfile().pipe(
      finalize(() => this.loadingProfile.set(false))
    ).subscribe({
      next: (profile) => this.patchProfile(profile),
      error: (error) => {
        this.profileError.set(error.error?.message || 'We could not load your account details right now.');
      }
    });
  }

  saveProfile(): void {
    this.profileMessage.set('');
    this.profileError.set('');

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const payload: UpdateAccountProfilePayload = {
      fullName: this.profileForm.getRawValue().fullName.trim(),
      address: this.profileForm.getRawValue().address.trim(),
    };

    this.savingProfile.set(true);
    this.authService.updateProfile(payload).pipe(
      finalize(() => this.savingProfile.set(false))
    ).subscribe({
      next: (profile) => {
        this.patchProfile(profile);
        this.profileMessage.set('Your profile was updated successfully.');
      },
      error: (error) => {
        this.profileError.set(this.getErrorMessage(error.error));
      }
    });
  }

  changePassword(): void {
    this.passwordMessage.set('');
    this.passwordError.set('');

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const value = this.passwordForm.getRawValue();
    if (value.newPassword !== value.confirmNewPassword) {
      this.passwordError.set('New password and confirmation do not match.');
      return;
    }

    const payload: ChangePasswordPayload = {
      currentPassword: value.currentPassword,
      newPassword: value.newPassword,
      confirmNewPassword: value.confirmNewPassword,
    };

    this.changingPassword.set(true);
    this.authService.changePassword(payload).pipe(
      finalize(() => this.changingPassword.set(false))
    ).subscribe({
      next: () => {
        this.passwordForm.reset({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        this.passwordMessage.set('Your password was updated successfully.');
      },
      error: (error) => {
        this.passwordError.set(this.getErrorMessage(error.error));
      }
    });
  }

  isProfileFieldInvalid(field: 'fullName' | 'address'): boolean {
    const control = this.profileForm.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  isPasswordFieldInvalid(field: 'currentPassword' | 'newPassword' | 'confirmNewPassword'): boolean {
    const control = this.passwordForm.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  private patchProfile(profile: AccountProfile): void {
    this.profileForm.reset({
      fullName: profile.fullName ?? '',
      email: profile.email ?? '',
      address: profile.address ?? '',
    });
  }

  private getErrorMessage(error: unknown): string {
    if (Array.isArray(error) && error.length > 0) {
      return error.map(item => item.description || item.code || 'Request failed').join(' ');
    }

    if (error && typeof error === 'object') {
      const record = error as Record<string, unknown>;

      if (typeof record['message'] === 'string') {
        return record['message'];
      }

      const firstModelState = Object.values(record).find(value => Array.isArray(value));
      if (Array.isArray(firstModelState) && firstModelState.length > 0) {
        return firstModelState.join(' ');
      }
    }

    return 'We could not save your changes right now.';
  }
}

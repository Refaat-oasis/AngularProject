import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { AdminRole, RegisterDto, UserWithRolesDto } from '../../../models/admin.models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  readonly availableRoles: AdminRole[] = ['User', 'Seller', 'Admin'];
  users: UserWithRolesDto[] = [];
  searchTerm = '';
  roleFilter: 'all' | AdminRole = 'all';
  statusFilter: 'all' | 'active' | 'blocked' = 'all';
  loading = false;
  refreshing = false;
  submitting = false;
  error: string | null = null;
  actionError: string | null = null;
  actionSuccess: string | null = null;
  showCreateModal = false;
  newAdmin: RegisterDto = this.createEmptyAdmin();

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers(true);
  }

  loadUsers(isInitial = false): void {
    if (isInitial) {
      this.loading = true;
    }
    this.refreshing = true;
    this.error = null;
    this.actionError = null;

    this.adminService.getAllUsers()
      .pipe(finalize(() => {
        this.loading = false;
        this.refreshing = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          this.users = data;
          this.cdr.detectChanges();
        },
        error: (err: unknown) => {
          console.error('Error loading users', err);
          this.error = this.getErrorMessage(err, 'Failed to load users. Please verify your connection.');
          this.cdr.detectChanges();
        }
      });
  }

  trackByUserId(index: number, user: UserWithRolesDto): string {
    return user.id;
  }

  get filteredUsers(): UserWithRolesDto[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.users.filter((user) => {
      const primaryRole = this.getPrimaryRole(user);
      const matchesSearch =
        !term ||
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.userName ?? '').toLowerCase().includes(term);

      const matchesRole = this.roleFilter === 'all' || primaryRole === this.roleFilter;
      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && !user.isDeleted) ||
        (this.statusFilter === 'blocked' && user.isDeleted);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  get adminCount(): number {
    return this.users.filter((user) => this.getPrimaryRole(user) === 'Admin').length;
  }

  get sellerCount(): number {
    return this.users.filter((user) => this.getPrimaryRole(user) === 'Seller').length;
  }

  get userCount(): number {
    return this.users.filter((user) => this.getPrimaryRole(user) === 'User').length;
  }

  get blockedCount(): number {
    return this.users.filter((user) => user.isDeleted).length;
  }

  getPrimaryRole(user: UserWithRolesDto): AdminRole {
    if (user.roles && user.roles.length > 0) {
      if (user.roles.includes('Admin')) return 'Admin';
      if (user.roles.includes('Seller')) return 'Seller';
      if (user.roles.includes('User')) return 'User';
    }
    return 'User';
  }

  toggleBlockStatus(user: UserWithRolesDto): void {
    const wasDeleted = user.isDeleted;
    const action = wasDeleted ? 'reactivate' : 'block';
    
    if (!window.confirm(`Are you sure you want to ${action} user ${user.fullName}?`)) return;

    user.isDeleted = !wasDeleted;
    this.actionError = null;
    this.actionSuccess = null;

    const request = wasDeleted ? 
      this.adminService.reactivateUser(user.id) : 
      this.adminService.blockUser(user.id);

    request.subscribe({
      next: () => {
        this.actionSuccess = `${user.fullName} has been ${wasDeleted ? 'reactivated' : 'blocked'}.`;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        user.isDeleted = wasDeleted;
        this.actionError = this.getErrorMessage(err, `Failed to ${action} user.`);
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  onRoleChange(newRole: AdminRole, user: UserWithRolesDto): void {
    const currentRole = this.getPrimaryRole(user);
    if (!newRole || newRole === currentRole) return;
    
    if (!window.confirm(`Change role of ${user.fullName} to ${newRole}?`)) {
      return;
    }

    const previousRoles = [...user.roles];
    user.roles = [newRole];
    this.actionError = null;
    this.actionSuccess = null;

    this.adminService.updateUserRole(user.id, { role: newRole }).subscribe({
      next: () => {
         this.actionSuccess = `${user.fullName}'s role was updated to ${newRole}.`;
         this.cdr.detectChanges();
      },
      error: (err: unknown) => {
         user.roles = previousRoles;
         this.actionError = this.getErrorMessage(err, 'Failed to update role.');
         console.error(err);
         this.cdr.detectChanges();
      }
    });
  }

  createAdmin(): void {
    if (this.submitting) {
      return;
    }

    if (!this.newAdmin.fullName.trim() || !this.newAdmin.email.trim() || !this.newAdmin.password.trim()) {
       this.actionError = 'Please fill in all required fields.';
       return;
    }

    this.submitting = true;
    this.actionError = null;
    this.actionSuccess = null;

    this.adminService.createAdmin(this.newAdmin)
      .pipe(finalize(() => {
        this.submitting = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
      next: () => {
        this.actionSuccess = 'Admin created successfully.';
        this.showCreateModal = false;
        this.newAdmin = this.createEmptyAdmin();
        this.loadUsers();
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        this.actionError = this.getErrorMessage(err, 'Error creating admin.');
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newAdmin = this.createEmptyAdmin();
  }

  private createEmptyAdmin(): RegisterDto {
    return { fullName: '', email: '', password: '', address: '' };
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error !== 'object' || error === null) {
      return fallback;
    }

    const maybeHttpError = error as {
      error?: { message?: string; errors?: Record<string, string[] | string> } | string;
      message?: string;
    };

    if (typeof maybeHttpError.error === 'string' && maybeHttpError.error.trim()) {
      return maybeHttpError.error;
    }

    if (typeof maybeHttpError.error === 'object' && maybeHttpError.error !== null) {
      if (maybeHttpError.error.message?.trim()) {
        return maybeHttpError.error.message;
      }

      const validationMessage = Object.values(maybeHttpError.error.errors ?? {})
        .flatMap((value) => Array.isArray(value) ? value : [value])
        .find((value) => typeof value === 'string' && value.trim());

      if (validationMessage) {
        return validationMessage;
      }
    }

    if (maybeHttpError.message?.trim()) {
      return maybeHttpError.message;
    }

    return fallback;
  }
}

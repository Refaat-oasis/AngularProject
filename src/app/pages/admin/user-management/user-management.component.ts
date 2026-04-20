import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { AdminRole, RegisterDto, UserWithRolesDto } from '../../../models/admin.models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  readonly availableRoles: AdminRole[] = ['User', 'Seller', 'Admin'];

  users = signal<UserWithRolesDto[]>([]);
  searchTerm = signal('');
  roleFilter = signal<'all' | AdminRole>('all');
  statusFilter = signal<'all' | 'active' | 'blocked'>('all');
  loading = signal(false);
  submitting = signal(false);
  actionSuccess = signal<string | null>(null);
  showCreateModal = signal(false);
  newAdmin = signal<RegisterDto>(this.createEmptyAdmin());

  filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.users().filter((user) => {
      const primaryRole = this.getPrimaryRole(user);
      const matchesSearch =
        !term ||
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.userName ?? '').toLowerCase().includes(term);

      const matchesRole = this.roleFilter() === 'all' || primaryRole === this.roleFilter();
      const matchesStatus =
        this.statusFilter() === 'all' ||
        (this.statusFilter() === 'active' && !user.isDeleted) ||
        (this.statusFilter() === 'blocked' && user.isDeleted);

      return matchesSearch && matchesRole && matchesStatus;
    });
  });

  adminCount = computed(() => this.users().filter((u) => this.getPrimaryRole(u) === 'Admin').length);
  sellerCount = computed(() => this.users().filter((u) => this.getPrimaryRole(u) === 'Seller').length);
  userCount = computed(() => this.users().filter((u) => this.getPrimaryRole(u) === 'User').length);
  blockedCount = computed(() => this.users().filter((u) => u.isDeleted).length);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  trackByUserId(index: number, user: UserWithRolesDto): string {
    return user.id;
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
    this.actionSuccess.set(null);

    const request = wasDeleted
      ? this.adminService.reactivateUser(user.id)
      : this.adminService.blockUser(user.id);

    request.subscribe({
      next: () => {
        this.actionSuccess.set(`${user.fullName} has been ${wasDeleted ? 'reactivated' : 'blocked'}.`);
      },
      error: (err) => {
        user.isDeleted = wasDeleted;
        console.error(err);
      }
    });
  }

  onRoleChange(newRole: AdminRole, user: UserWithRolesDto): void {
    const currentRole = this.getPrimaryRole(user);
    if (!newRole || newRole === currentRole) return;

    if (!window.confirm(`Change role of ${user.fullName} to ${newRole}?`)) return;

    const previousRoles = [...user.roles];
    user.roles = [newRole];
    this.actionSuccess.set(null);

    this.adminService.updateUserRole(user.id, { role: newRole }).subscribe({
      next: () => {
        this.actionSuccess.set(`${user.fullName}'s role was updated to ${newRole}.`);
      },
      error: (err) => {
        user.roles = previousRoles;
        console.error(err);
      }
    });
  }

  createAdmin(): void {
    if (this.submitting()) return;

    const admin = this.newAdmin();
    if (!admin.fullName.trim() || !admin.email.trim() || !admin.password.trim()) return;

    this.submitting.set(true);
    this.actionSuccess.set(null);

    this.adminService.createAdmin(admin).subscribe({
      next: () => {
        this.actionSuccess.set('Admin created successfully.');
        this.submitting.set(false);
        this.showCreateModal.set(false);
        this.newAdmin.set(this.createEmptyAdmin());
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        this.submitting.set(false);
      }
    });
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.newAdmin.set(this.createEmptyAdmin());
  }

  private createEmptyAdmin(): RegisterDto {
    return { fullName: '', email: '', password: '', address: '' };
  }
}

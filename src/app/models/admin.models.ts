export interface UserWithRolesDto {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  address: string;
  isDeleted: boolean;
  roles: string[];
}

export type AdminRole = 'Admin' | 'Seller' | 'User';

export interface UpdateRoleDto {
  role: AdminRole;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  address: string;
}

export interface AdminActionResponse {
  message?: string;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  UserWithRolesDto,
  AdminActionResponse,
  RegisterDto,
  UpdateRoleDto
} from '../models/admin.models';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/Admin`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserWithRolesDto[]> {
    return this.http.get<unknown>(`${this.baseUrl}/users`).pipe(
      map((response) => this.extractUsers(response))
    );
  }

  getUserDetails(id: string): Observable<UserWithRolesDto> {
    return this.http.get<UserWithRolesDto>(`${this.baseUrl}/users/${id}`);
  }

  blockUser(id: string): Observable<AdminActionResponse> {
    return this.http.put(`${this.baseUrl}/users/${id}/block`, {}, { responseType: 'text' }).pipe(
      map((message) => ({ message }))
    );
  }

  reactivateUser(id: string): Observable<AdminActionResponse> {
    return this.http.put(`${this.baseUrl}/users/${id}/reactivate`, {}, { responseType: 'text' }).pipe(
      map((message) => ({ message }))
    );
  }

  createAdmin(data: RegisterDto): Observable<AdminActionResponse> {
    return this.http.post(`${this.baseUrl}/users/admin`, data, { responseType: 'text' }).pipe(
      map((message) => ({ message }))
    );
  }

  updateUserRole(id: string, roleDto: UpdateRoleDto): Observable<AdminActionResponse> {
    return this.http.put(`${this.baseUrl}/users/${id}/role`, roleDto, { responseType: 'text' }).pipe(
      map((message) => ({ message }))
    );
  }

  private extractUsers(response: unknown): UserWithRolesDto[] {
    if (Array.isArray(response)) {
      return response as UserWithRolesDto[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const record = response as Record<string, unknown>;
    const candidates = [
      record['result'],
      record['data'],
      record['users'],
      record['value'],
      record['items'],
      record['$values']
    ];

    for (const candidate of candidates) {
      const extracted = this.extractUsers(candidate);
      if (extracted.length) {
        return extracted;
      }
    }

    return [];
  }
}

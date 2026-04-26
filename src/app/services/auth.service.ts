import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environment';

export interface AccountProfile {
  fullName: string;
  email: string;
  address: string;
}

export interface UpdateAccountProfilePayload {
  fullName: string;
  address: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/Account`;
  loggedIn = signal<boolean>(!!(localStorage.getItem('token') || sessionStorage.getItem('token')));

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        const rawToken = res.token?.result || res.token || res.result || res;
        this.saveAuthData(rawToken, credentials.rememberMe);
      })
    );
  }

  private saveAuthData(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('token', token);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
    }
    this.loggedIn.set(true);
  }

  register(userData: any): Observable<any> {
    const payload = {
      fullName: userData.name,
      email: userData.email,
      password: userData.password,
      address: userData.address,
      role: userData.role
    };

    return this.http.post<any>(`${this.baseUrl}/register`, payload);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }

  getProfile(): Observable<AccountProfile> {
    return this.http.get<AccountProfile>(`${this.baseUrl}/profile`);
  }

  updateProfile(payload: UpdateAccountProfilePayload): Observable<AccountProfile> {
    return this.http.put<AccountProfile>(`${this.baseUrl}/profile`, payload);
  }

  changePassword(payload: ChangePasswordPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/change-password`, payload);
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.loggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | string[] {
    let token = this.getToken();
    if (!token) return '';
    if (token.startsWith('Bearer ')) token = token.substring(7);
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
    } catch (e) {
      console.error('JWT Decode error', e);
      return '';
    }
  }

  getUserId(): string {
    let token = this.getToken();
    if (!token) return '';
    if (token.startsWith('Bearer ')) token = token.substring(7);

    try {
      const decoded: any = jwtDecode(token);
      return decoded.nameid || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    } catch (e) {
      return '';
    }
  }

  getUserEmail(): string {
    let token = this.getToken();
    if (!token) return '';
    if (token.startsWith('Bearer ')) token = token.substring(7);

    try {
      const decoded: any = jwtDecode(token);
      return decoded.email || decoded.unique_name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';
    } catch (e) {
      return '';
    }
  }
}

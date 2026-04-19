import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Your API project is located at: C:\Users\ahta6\OneDrive\Desktop\.Net API & Angular project\ApiProject
  private baseUrl = 'http://localhost:5118/api/Account';
  loggedIn = signal<boolean>(!!(localStorage.getItem('token') || sessionStorage.getItem('token')));

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        console.log('LOGIN RESPONSE:', res);
        const rawToken = res.token?.result || res.token || res.result || res;
        this.saveAuthData(rawToken, credentials.rememberMe);
      })
    );
  }

  private saveAuthData(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('token', token);
      sessionStorage.removeItem('token');
      console.log(token);
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
      console.log(token);
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
}

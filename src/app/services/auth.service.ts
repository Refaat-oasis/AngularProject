import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Your API project is located at: C:\Users\ahta6\OneDrive\Desktop\.Net API & Angular project\ApiProject
  private baseUrl = 'http://localhost:5118/api/Account';
  loggedIn = signal<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
    tap(res => {
        console.log("LOGIN RESPONSE:", res);
          const token = res.token.result;
      this.saveAuthData(token , credentials.rememberMe);
    })
  );
}

  private saveAuthData(token: string,rememberMe:boolean ) {
  if (rememberMe) {
      localStorage.setItem('token', token );
      console.log(token);
    } else {
      sessionStorage.setItem('token', token);
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
  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token') ;
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token')|| sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

getUserRole(): string {
  const token = this.getToken();
  if (!token) return '';

  const decoded: any = jwtDecode(token);

  return decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
}

getUserId(): string {
  const token = this.getToken();
  if (!token) return '';

  const decoded: any = jwtDecode(token);

  return decoded.nameid || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}
}

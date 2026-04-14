import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Placeholder variable for your .NET API URL
  // Your API project is located at: C:\Users\ahta6\OneDrive\Desktop\.Net API & Angular project\ApiProject
  private baseUrl = 'http://localhost:5118/api/Account';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
    tap(res => {
      this.saveAuthData(res.token);
    })
  );
}

  private saveAuthData(token: string) {
    localStorage.setItem('token', token);
    console.log('Token saved to localStorage:', token);
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
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }
}

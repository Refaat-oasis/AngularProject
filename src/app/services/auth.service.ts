import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Placeholder variable for your .NET API URL
  // Your API project is located at: C:\Users\ahta6\OneDrive\Desktop\.Net API & Angular project\ApiProject
  private baseUrl = 'https://localhost:7001/api/auth'; 

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    // Junior Tip: We'll eventually replace this with a real API call
    // return this.http.post(`${this.baseUrl}/login`, credentials);
    
    // For now, let's mock a successful login to localStorage
    return of({ token: 'mock-jwt-token', role: credentials.role || 'Customer' }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userRole', res.role);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }
}

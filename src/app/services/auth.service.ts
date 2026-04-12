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
    // This will be replaced with real .NET API call:
    // return this.http.post<any>(`${this.baseUrl}/login`, credentials);
    
    // Mocking a professional JWT response
    const mockResponse = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Mock JWT
      user: {
        id: 'user-123',
        email: credentials.email,
        role: credentials.role || 'Customer',
        name: 'The Merchant'
      }
    };

    return of(mockResponse).pipe(
      tap(res => {
        this.saveAuthData(res.token, res.user.role);
      })
    );
  }

  private saveAuthData(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
  }

  register(userData: any): Observable<any> {
    // return this.http.post(`${this.baseUrl}/register`, userData);
    return of({ success: true, message: 'Account created successfully' });
  }

  logout() {
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

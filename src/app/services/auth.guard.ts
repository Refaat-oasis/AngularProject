import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const userRole = this.authService.getUserRole();
    console.log("AuthGuard Triggered for route:", route.routeConfig?.path);
    console.log("Expected Role:", expectedRole, "| User Role:", userRole);

    if (!this.authService.isLoggedIn()) {
      console.warn("AuthGuard: NOT LOGGED IN. Redirecting to /login.");
      this.router.navigate(['/login']);
      return false;
    }

    // Role-based check
    if (expectedRole) {
      // Normalize user roles into an array
      const roles = Array.isArray(userRole) ? userRole : [userRole];
      
      const hasPermission = roles.includes(expectedRole) || roles.includes('Admin');
      console.log("AuthGuard Permission Check:", hasPermission, "Against roles array:", roles);

      if (!hasPermission) {
        console.warn("AuthGuard: Permission Denied. Redirecting to /.");
        alert('You do not have permission to access this page.');
        this.router.navigate(['/']);
        return false;
      }
    }

    console.log("AuthGuard: Access GRANTED.");
    return true;
  }
}

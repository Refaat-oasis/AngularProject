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

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Role-based check
    if (expectedRole) {
      const roles = Array.isArray(userRole) ? userRole : [userRole];
      const hasPermission = roles.includes(expectedRole) || roles.includes('Admin');

      if (!hasPermission) {
        this.router.navigate(['/']);
        return false;
      }
    }

    return true;
  }
}

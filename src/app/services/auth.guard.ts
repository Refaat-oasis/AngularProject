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
    if (expectedRole && userRole !== expectedRole && userRole !== 'Admin') {
      alert('You do not have permission to access this page.');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}

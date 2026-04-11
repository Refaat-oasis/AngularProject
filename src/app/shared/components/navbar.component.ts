import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg glass-effect sticky-top shadow-sm py-3">
      <div class="container">
        <a class="navbar-brand fw-bold mb-0" routerLink="/">
          <span class="gradient-text h2">ELITE</span><span class="text-dark h2">STORE</span>
        </a>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center gap-3">
            <li class="nav-item">
              <a class="nav-link fw-medium text-dark px-3" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            </li>
            <li class="nav-item" *ngIf="!isLoggedIn()">
              <a class="nav-link fw-medium text-dark px-3" routerLink="/login text-decoration-none">Login</a>
            </li>
            <li class="nav-item" *ngIf="!isLoggedIn()">
              <a class="btn-premium text-decoration-none d-inline-block" routerLink="/register">Get Started</a>
            </li>
            
            <li class="nav-item dropdown ms-lg-3" *ngIf="isLoggedIn()">
              <div class="d-flex align-items-center gap-2">
                <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                  {{ userRole?.charAt(0) || 'U' }}
                </div>
                <div class="d-none d-xl-block">
                  <p class="mb-0 small fw-bold">{{ userRole }}</p>
                </div>
                <button class="btn btn-link text-danger p-0 ms-2" (click)="logout()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand { letter-spacing: 1px; }
    .nav-link.active { font-weight: bold; border-bottom: 2px solid white; }
  `]
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  get userRole() {
    return this.authService.getUserRole();
  }

  logout() {
    this.authService.logout();
    window.location.reload(); // Quick way to reset state for a junior dev
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">E-STORE</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item" *ngIf="!isLoggedIn()">
              <a class="nav-link btn btn-outline-light me-2 px-3" routerLink="/login">Login</a>
            </li>
            <li class="nav-item" *ngIf="!isLoggedIn()">
              <a class="nav-link btn btn-primary px-3" routerLink="/register">Register</a>
            </li>
            
            <!-- Show these if logged in -->
            <li class="nav-item mx-2" *ngIf="isLoggedIn()">
              <span class="text-light me-3 small">Role: {{ userRole }}</span>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn()">
              <button class="btn btn-danger btn-sm" (click)="logout()">Logout</button>
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

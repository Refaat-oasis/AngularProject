import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { CartService } from '../../../services/cart.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule , FormsModule],
  template: `
    <header class="fixed top-0 w-full z-50 glass-header">
      <div class="container-fluid px-6 py-3 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-5">
          <a routerLink="/" class="text-xl font-bold tracking-tighter text-dark text-decoration-none">
            Architectural Merchant
          </a>
          <nav class="d-none d-md-flex align-items-center gap-4 text-sm font-medium">
            <a routerLink="/" class="text-dark text-decoration-none hover-secondary transition-colors" routerLinkActive="text-secondary border-bottom border-2 border-secondary">Shop</a>
            <a routerLink="/vendors" class="text-secondary-variant text-decoration-none hover-secondary transition-colors">Vendors</a>
            <a routerLink="/help" class="text-secondary-variant text-decoration-none hover-secondary transition-colors">Help</a>
          </nav>
        </div>

        <div class="d-flex align-items-center gap-4">
          <div class="d-none d-lg-flex align-items-center bg-light px-3 py-1.5 rounded-pill border-light focus-within-border">
            <span class="material-symbols-outlined text-secondary fs-5 me-2">search</span>
          <input type="text"
  class="bg-transparent border-0 outline-none text-sm w-48"
  placeholder="Search..."
  [(ngModel)]="searchTerm"
  (ngModelChange)="onSearchChange($event)" />
          </div>

          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-link p-0 text-dark scale-hover">
              <span class="material-symbols-outlined">favorite</span>
            </button>
            <button class="btn btn-link p-0 text-dark scale-hover position-relative" routerLink="/cart">
              <span class="material-symbols-outlined">shopping_cart</span>
              <span *ngIf="(cartService.cartCount$ | async) as count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem;">
                {{ count }}
              </span>
            </button>

            <ng-container *ngIf="authService.isLoggedIn(); else loginBtn">
              <button class="btn btn-link p-0 text-dark scale-hover" [routerLink]="dashboardLink">
                <span class="material-symbols-outlined">dashboard</span>
              </button>
              <button class="btn btn-link p-0 text-dark scale-hover" (click)="logout()">
                <span class="material-symbols-outlined">logout</span>
              </button>
            </ng-container>

            <ng-template #loginBtn>
              <button class="btn btn-link p-0 text-dark scale-hover" routerLink="/login">
                <span class="material-symbols-outlined">person</span>
              </button>
            </ng-template>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .text-secondary-variant { color: var(--on-surface-variant); }
    .hover-secondary:hover { color: var(--secondary) !important; }
    .transition-colors { transition: var(--transition-smooth); }
    .scale-hover:hover { transform: scale(1.1); transition: transform 0.2s; }
    .focus-within-border:focus-within { border: 1px solid var(--secondary) !important; }
    header { height: 72px; }
    .glass-header { z-index: 1040; background-color: rgba(255,255,255,0.9); }
  `]
})
export class NavbarComponent {
  searchTerm: string = '';
  searchSubject = new Subject<string>();
  constructor(
    public authService: AuthService,
    private router: Router,
    public cartService: CartService
  ) {
    this.searchSubject.pipe(
      debounceTime(400),
    ).subscribe(term => {
      this.router.navigate(['/products'], {
        queryParams: { search: term }
      });
    });
  }

  get dashboardLink(): string {
    const role = this.authService.getUserRole();
    if (role === 'Admin') return '/admin';
    if (role === 'Seller') return '/seller';
    return '/';
  }
// onSearch() {
//   if (this.searchTerm.trim()) {
//     this.router.navigate(['/products'], {
//       queryParams: { search: this.searchTerm }
//     });
//   }}
  onSearchChange(value: string) {
  this.searchSubject.next(value);
}
  logout() {
    this.authService.logout();
    window.location.reload();
  }
}


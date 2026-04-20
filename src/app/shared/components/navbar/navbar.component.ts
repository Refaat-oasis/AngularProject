import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="promo-bar">
      <span><span class="material-symbols-outlined fs-6 align-middle me-1">local_shipping</span> Free Shipping on Orders Over $50</span>
      <span class="d-none d-md-inline opacity-50">|</span>
      <span class="d-none d-md-inline"><span class="material-symbols-outlined fs-6 align-middle me-1">loyalty</span> Up to 50% Off Select Styles</span>
    </div>
    <header class="nav-header" [class.fixed]="fixed()" [class.top-0]="fixed()">
      <div class="container-fluid px-3 px-md-4 d-flex align-items-center justify-content-between" style="height: 64px;">
        <!-- Logo -->
        <button (click)="navigateTo('/')" class="nav-brand">
          <span class="material-symbols-outlined brand-bag" style="font-variation-settings: 'FILL' 1;">shopping_bag</span>
          <span class="d-none d-md-inline brand-text">NEXUS</span>
        </button>

        <!-- Desktop Search -->
        <div class="d-none d-md-flex flex-grow-1 justify-content-center px-4" style="max-width: 480px;">
          <div class="search-wrap">
            <span class="material-symbols-outlined search-icon">search</span>
            <input type="text" class="search-input"
              placeholder="Search products..."
              aria-label="Search products"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange($event)">
          </div>
        </div>

        <!-- Action Icons -->
        <div class="d-flex align-items-center gap-1 gap-md-2">
          <button (click)="themeService.toggleTheme()" class="nav-icon-btn" title="Toggle Theme" aria-label="Toggle theme">
            <span class="material-symbols-outlined">
              {{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>

          <button class="nav-icon-btn position-relative" (click)="navigateTo('/cart')" title="Shopping Cart" aria-label="Open shopping cart">
            <span class="material-symbols-outlined">shopping_cart</span>
            <span *ngIf="(cartService.cartCount$ | async) as count" class="cart-badge">
              {{ count }}
            </span>
          </button>

          <ng-container *ngIf="authService.isLoggedIn(); else loginBtn">
            <button class="nav-icon-btn" (click)="navigateTo('/orders')" title="My Orders" aria-label="Open my orders">
              <span class="material-symbols-outlined">receipt_long</span>
            </button>

            <button *ngIf="showDashboardIcon" class="nav-icon-btn" (click)="navigateTo(dashboardLink)" title="Dashboard" aria-label="Open dashboard">
              <span class="material-symbols-outlined">dashboard</span>
            </button>

            <button class="nav-icon-btn" (click)="logout()" title="Logout" aria-label="Log out">
              <span class="material-symbols-outlined">logout</span>
            </button>
          </ng-container>

          <ng-template #loginBtn>
            <button class="nav-icon-btn" (click)="navigateTo('/login')" title="Login" aria-label="Open login page">
              <span class="material-symbols-outlined">person</span>
            </button>
          </ng-template>

          <button class="d-md-none nav-icon-btn" (click)="mobileSearchOpen = !mobileSearchOpen" title="Search" aria-label="Toggle search">
            <span class="material-symbols-outlined">search</span>
          </button>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div *ngIf="mobileSearchOpen" class="d-md-none px-3 pb-3">
        <div class="search-wrap">
          <span class="material-symbols-outlined search-icon">search</span>
          <input type="text" class="search-input"
            placeholder="Search products..."
            aria-label="Search products"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)">
        </div>
      </div>
    </header>
  `,
  styles: [`
    /* Promo Bar */
    .promo-bar {
      background: var(--primary);
      color: var(--background);
      text-align: center;
      padding: 0.45rem 1rem;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      position: relative;
      z-index: 1041;
    }

    /* Header */
    .nav-header {
      z-index: 1040;
      position: sticky;
      top: 0;
      background: var(--surface);
      border-bottom: 1px solid var(--outline-variant);
      transition: var(--transition-smooth);
    }

    /* Logo */
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand-bag {
      font-size: 28px;
      color: var(--secondary);
    }
    .brand-text {
      font-family: var(--font-headline);
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: var(--on-surface);
    }

    /* Search */
    .search-wrap {
      position: relative;
      width: 100%;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      color: var(--on-surface-variant);
      pointer-events: none;
      z-index: 1;
    }
    .search-input {
      width: 100%;
      padding: 0.6rem 1rem 0.6rem 42px !important;
      background: var(--surface-container-low) !important;
      border: 1px solid var(--outline-variant) !important;
      border-radius: 100px !important;
      color: var(--on-surface) !important;
      font-size: 0.875rem;
      outline: none;
      transition: var(--transition-smooth);
    }
    .search-input::placeholder {
      color: var(--on-surface-variant) !important;
      opacity: 0.6;
    }
    .search-input:focus {
      background: var(--surface) !important;
      border-color: var(--secondary) !important;
      box-shadow: 0 0 0 3px rgba(0, 99, 151, 0.15) !important;
    }

    /* Icon Buttons */
    .nav-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--on-surface);
      transition: var(--transition-smooth);
      padding: 0;
      position: relative;
    }
    .nav-icon-btn .material-symbols-outlined {
      font-size: 24px;
    }
    .nav-icon-btn:hover {
      background: var(--surface-container-low);
      color: var(--secondary);
    }

    /* Cart Badge */
    .cart-badge {
      position: absolute;
      top: 2px;
      right: 2px;
      background: var(--error);
      color: var(--on-error);
      font-size: 0.6rem;
      font-weight: 700;
      padding: 0.15em 0.45em;
      border-radius: 100px;
      min-width: 16px;
      text-align: center;
      line-height: 1.3;
    }

    @media (max-width: 767px) {
      .nav-icon-btn {
        width: 36px;
        height: 36px;
      }
      .nav-icon-btn .material-symbols-outlined {
        font-size: 22px;
      }
    }
  `]
})
export class NavbarComponent {
  readonly fixed = input(true);
  searchTerm: string = '';
  searchSubject = new Subject<string>();
  mobileSearchOpen = false;

  public themeService = inject(ThemeService);

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

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  get dashboardLink(): string {
    const role = this.authService.getUserRole();
    if (role === 'Admin') return '/admin';
    if (role === 'Seller') return '/seller/products';
    return '/';
  }

  get showDashboardIcon(): boolean {
    const role = this.authService.getUserRole();
    return role === 'Admin' || role === 'Seller';
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}

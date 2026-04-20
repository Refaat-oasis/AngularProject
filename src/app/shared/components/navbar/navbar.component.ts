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
  imports: [CommonModule, RouterModule , FormsModule],
  template: `
    <header class="w-full z-50 glass-header" [class.fixed]="fixed()" [class.top-0]="fixed()">
      <div class="container-fluid px-6 h-full d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-5">
          <button (click)="navigateTo('/')" class="btn btn-link p-0 d-flex align-items-center gap-3 text-xl font-bold tracking-tighter text-theme text-decoration-none border-0">
            <img src="/images/logo.png" alt="Logo" style="height: 54px; width: auto; filter: drop-shadow(0 0 8px rgba(0,0,0,0.08)); transform: translateY(-2px);" />
            <span class="d-none d-md-inline">Architectural Merchant</span>
          </button>
        </div>

        <div class="d-flex align-items-center gap-4">
          <button (click)="themeService.toggleTheme()" class="btn btn-link p-0 text-theme scale-hover border-0" title="Toggle Theme">
            <span class="material-symbols-outlined" style="font-size: 28px;">
              {{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>
          
          <button class="btn btn-link p-0 text-theme scale-hover position-relative border-0" (click)="navigateTo('/cart')" title="Shopping Cart">
            <span class="material-symbols-outlined" style="font-size: 28px;">shopping_cart</span>
            <span *ngIf="(cartService.cartCount$ | async) as count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border-0" style="font-size: 0.65rem; padding: 0.35em 0.65em;">
              {{ count }}
            </span>
          </button>

          <ng-container *ngIf="authService.isLoggedIn(); else loginBtn">
            <button class="btn btn-link p-0 text-theme scale-hover border-0" (click)="navigateTo('/orders')" title="My Orders">
              <span class="material-symbols-outlined" style="font-size: 28px;">receipt_long</span>
            </button>
            
            <button *ngIf="showDashboardIcon" class="btn btn-link p-0 text-theme scale-hover border-0" (click)="navigateTo(dashboardLink)" title="Dashboard">
              <span class="material-symbols-outlined" style="font-size: 28px;">dashboard</span>
            </button>
            
            <button class="btn btn-link p-0 text-theme scale-hover border-0" (click)="logout()" title="Logout">
              <span class="material-symbols-outlined" style="font-size: 28px;">logout</span>
            </button>
          </ng-container>

          <ng-template #loginBtn>
            <button class="btn btn-link p-0 text-theme scale-hover border-0" (click)="navigateTo('/login')" title="Login">
              <span class="material-symbols-outlined" style="font-size: 28px;">person</span>
            </button>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .text-theme { color: var(--on-surface); }
    .scale-hover { transition: var(--transition-smooth); }
    .scale-hover:hover { transform: translateY(-2px) scale(1.05); color: var(--secondary); }
    header { height: 88px; transition: var(--transition-smooth); }
    .glass-header { 
      z-index: 1040; 
      position: sticky; 
      top: 0; 
      background: var(--glass-bg); 
      backdrop-filter: blur(24px); 
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 10px 40px -15px rgba(0,0,0,0.08);
      border-bottom: none !important;
    }
    .btn-link { text-decoration: none; display: flex; align-items: center; }
    .material-symbols-outlined { transition: var(--transition-smooth); }
  `]
})
export class NavbarComponent {
  readonly fixed = input(true);
  searchTerm: string = '';
  searchSubject = new Subject<string>();
  
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
    if (role === 'Seller') return '/seller';
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

import { CommonModule } from '@angular/common';
import { Component, input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { FavouritesService } from '../../../services/favourites.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  readonly fixed = input(true);
  searchTerm = '';
  searchSubject = new Subject<string>();
  mobileSearchOpen = false;

  public themeService = inject(ThemeService);
  public favouritesService = inject(FavouritesService);

  constructor(
    public authService: AuthService,
    private router: Router,
    public cartService: CartService
  ) {
    this.searchSubject.pipe(
      debounceTime(400)
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

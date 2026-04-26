import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NavbarComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent {
  pageTitle = 'Admin Dashboard';
  pageDescription = 'Review users, update roles, and control account access.';

  private routeMap: Record<string, { title: string; desc: string }> = {
    users: { title: 'User Management', desc: 'Review users, update roles, and control account access.' },
    products: { title: 'Product Management', desc: 'Add, edit, or remove products from the catalog.' },
    categories: { title: 'Category Management', desc: 'Organize your product catalog with categories.' },
    orders: { title: 'Order Management', desc: 'Track and manage all customer orders.' }
  };

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: any) => {
        const url: string = e.urlAfterRedirects || e.url;
        const segments = url.split('/');
        return segments[segments.length - 1];
      })
    ).subscribe(segment => {
      const match = this.routeMap[segment];
      if (match) {
        this.pageTitle = match.title;
        this.pageDescription = match.desc;
      }
    });
  }
}

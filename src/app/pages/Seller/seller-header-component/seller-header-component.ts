import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-header-component',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './seller-header-component.html',
  styleUrl: './seller-header-component.css',
})
export class SellerHeaderComponent {
  private router = inject(Router);

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-header-component',
  imports: [RouterModule],
  templateUrl: './seller-header-component.html',
  styleUrl: './seller-header-component.css',
})
export class SellerHeaderComponent {
   constructor(private router: Router) {}
  logout() {
  localStorage.clear();
  this.router.navigate(['/login']);
}
}

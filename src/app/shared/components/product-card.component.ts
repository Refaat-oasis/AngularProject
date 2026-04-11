import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card h-100 shadow-sm transition-hover">
      <img [src]="product.imageUrl || 'assets/placeholder.jpg'" class="card-img-top" [alt]="product.name" style="height: 200px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title text-truncate">{{ product.name }}</h5>
        <p class="card-text text-muted small">{{ product.description }}</p>
        <div class="d-flex justify-content-between align-items-center">
          <span class="h6 mb-0 text-primary">{{ product.price | currency }}</span>
          <button class="btn btn-outline-primary btn-sm rounded-pill">View Details</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transition-hover:hover {
      transform: translateY(-5px);
      transition: all 0.3s ease-in-out;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
    }
  `]
})
export class ProductCardComponent {
  @Input() product: any;
}

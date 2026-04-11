import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card card-premium h-100 border-0">
      <div class="position-relative overflow-hidden">
        <img [src]="product.imageUrl || 'assets/placeholder.jpg'" class="card-img-top" [alt]="product.name" style="height: 240px; object-fit: cover; transition: var(--transition);">
        <div class="position-absolute top-0 end-0 m-3">
          <button class="btn btn-white btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
      </div>
      <div class="card-body p-4">
        <div class="mb-2">
          <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 small fw-bold">Electronics</span>
        </div>
        <h5 class="card-title fw-bold mb-2 text-truncate">{{ product.name }}</h5>
        <p class="card-text text-secondary small mb-4 line-clamp-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ product.description }}</p>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <span class="h4 fw-bold mb-0 text-dark">{{ product.price | currency }}</span>
          <button class="btn btn-dark rounded-3 px-4 py-2 small fw-bold">View</button>
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Product } from '../../services/mock-data.service';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid px-lg-5 pt-5 mt-5 max-w-7xl">
      <div class="row g-5">
        <!-- Sidebar Filters -->
        <aside class="col-lg-3 d-none d-lg-block">
          <div class="sticky-top" style="top: 100px;">
            <div class="mb-5">
              <h3 class="h5 fw-bold mb-4">Categories</h3>
              <ul class="list-unstyled space-y-3">
                <li *ngFor="let cat of categories">
                  <a href="#" class="text-secondary text-decoration-none hover-primary d-flex justify-content-between">
                    {{ cat }}
                    <span class="text-secondary-variant small">(12)</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div class="mb-5">
              <h3 class="h5 fw-bold mb-4">Price Range</h3>
              <input type="range" class="form-range custom-range" min="0" max="5000" step="100">
              <div class="d-flex justify-content-between mt-2 small text-secondary">
                <span>$0</span>
                <span>$5,000+</span>
              </div>
            </div>
          </div>
        </aside>
        
        <!-- Main Grid -->
        <main class="col-lg-9">
          <div class="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom border-light">
            <h1 class="h3 fw-bold mb-0">The Collection <span class="text-secondary-variant small fw-normal ms-2">({{ products.length }} items)</span></h1>
            <div class="d-flex gap-3 align-items-center">
              <span class="text-secondary small">Sort by:</span>
              <select class="form-select form-select-sm border-0 bg-light px-3 fw-medium">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            <div class="col" *ngFor="let product of products">
              <div class="merchant-card h-100 p-0 border-0 group cursor-pointer overflow-hidden">
                <div class="aspect-5-6 position-relative overflow-hidden bg-white mb-3 rounded-top-3">
                  <img [src]="product.imageUrl" class="w-100 h-100 object-fit-cover transition-transform group-hover-scale" [alt]="product.name">
                  <button class="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle p-2 shadow-sm opacity-0 group-hover-opacity transition-opacity">
                    <span class="material-symbols-outlined text-secondary fs-5">favorite</span>
                  </button>
                </div>
                <div class="p-3">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="badge bg-tertiary-container text-on-tertiary-container text-uppercase fw-bold ls-wider" *ngIf="product.verified">Verified</span>
                    <span class="text-uppercase text-secondary-variant ls-widest fw-medium" style="font-size: 0.65rem;">SKU: {{ product.sku }}</span>
                  </div>
                  <h4 class="h6 fw-bold text-dark mb-1">{{ product.name }}</h4>
                  <p class="text-secondary small mb-2">{{ product.brand }}</p>
                  <p class="text-secondary fw-bold">{{ product.price | currency }}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .max-w-7xl { max-width: 1400px; margin: 0 auto; min-height: 80vh; }
    .aspect-5-6 { aspect-ratio: 4 / 5; }
    .space-y-3 > li { margin-bottom: 0.75rem; }
    .text-secondary-variant { color: var(--on-surface-variant); }
    .hover-primary:hover { color: var(--primary) !important; }
    .group-hover-scale:hover { transform: scale(1.05); transition: transform 0.5s; }
    .merchant-card:hover .group-hover-scale { transform: scale(1.05); }
    .group-hover-opacity { opacity: 1 !important; transition: opacity 0.3s; }
    .ls-wider { letter-spacing: 0.05em; }
    .ls-widest { letter-spacing: 0.1em; }
    .bg-tertiary-container { background-color: var(--tertiary-container); color: var(--on-tertiary-container); font-size: 0.6rem; }
    .custom-range::-webkit-slider-runnable-track { background: var(--outline-variant); }
    .custom-range::-webkit-slider-thumb { background: var(--secondary); }
  `]
})
export class ProductListingComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = ['Lighting', 'Hardware', 'Surfaces', 'Furniture', 'Decor'];

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getProducts().subscribe((prods: Product[]) => this.products = prods);
  }
}

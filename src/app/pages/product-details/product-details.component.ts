import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockDataService, Product } from '../../services/mock-data.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid px-lg-5 pt-5 mt-5 max-w-7xl" *ngIf="product">
      <div class="row g-5">
        <!-- Gallery -->
        <div class="col-lg-7">
          <div class="product-gallery rounded-5 overflow-hidden bg-white">
            <img [src]="product.imageUrl" class="w-100 h-100 object-fit-cover" [alt]="product.name">
          </div>
          <div class="row g-3 mt-3">
            <div class="col-3" *ngFor="let i of [1,2,3,4]">
              <div class="thumb-card aspect-square rounded-4 overflow-hidden bg-light cursor-pointer border-hover">
                <img [src]="product.imageUrl" class="w-100 h-100 object-fit-cover opacity-50" [alt]="product.name">
              </div>
            </div>
          </div>
        </div>
        
        <!-- Info -->
        <div class="col-lg-5">
          <div class="sticky-top" style="top: 100px;">
            <div class="d-flex align-items-center gap-2 mb-4">
              <span class="badge bg-tertiary-container text-on-tertiary-container text-uppercase fw-bold ls-wider">Verified Merchant</span>
              <span class="text-uppercase text-secondary-variant ls-widest fw-medium small">SKU: {{ product.sku }}</span>
            </div>
            
            <h1 class="display-5 fw-bold mb-3 font-headline">{{ product.name }}</h1>
            <p class="h4 text-secondary fw-bold mb-4">{{ product.price | currency }}</p>
            
            <div class="mb-5">
              <h3 class="h6 fw-bold uppercase ls-wider text-secondary mb-3">Description</h3>
              <p class="text-on-surface-variant leading-relaxed">{{ product.description }}</p>
              <p class="text-on-surface-variant leading-relaxed">
                Expertly Curated from {{ product.brand }}. This piece embodies the structural integrity and aesthetic grace that defines our collection.
              </p>
            </div>
            
            <div class="row g-3 mb-5">
              <div class="col-12">
                <button class="btn btn-primary-merchant w-100 py-3 shadow-lg">Add to Collection</button>
              </div>
              <div class="col-12">
                <button class="btn btn-outline-secondary w-100 py-3 border-light hover-bg-light text-dark fw-bold">
                  <span class="material-symbols-outlined align-middle me-2">favorite</span>
                  Wishlist Item
                </button>
              </div>
            </div>
            
            <div class="p-4 rounded-4 bg-surface-container-low border border-light">
              <div class="d-flex gap-3 align-items-start mb-3">
                <span class="material-symbols-outlined text-secondary">local_shipping</span>
                <div>
                  <h4 class="h6 fw-bold mb-1">Architectural Shipping</h4>
                  <p class="small text-secondary-variant mb-0">Insured professional handling for delicate components. Est. 2-3 weeks.</p>
                </div>
              </div>
              <div class="d-flex gap-3 align-items-start">
                <span class="material-symbols-outlined text-secondary">verified_user</span>
                <div>
                  <h4 class="h6 fw-bold mb-1">Authenticity Guaranteed</h4>
                  <p class="small text-secondary-variant mb-0">Comes with a certificate of authenticity signed by the artisan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .max-w-7xl { max-width: 1400px; margin: 0 auto; min-height: 90vh; }
    .product-gallery { height: 600px; }
    .aspect-square { aspect-ratio: 1 / 1; }
    .thumb-card { border: 2px solid transparent; transition: all 0.3s; }
    .border-hover:hover { border-color: var(--secondary) !important; }
    .text-secondary-variant { color: var(--on-surface-variant); }
    .bg-tertiary-container { background-color: var(--tertiary-container); color: var(--on-tertiary-container); font-size: 0.7rem; }
    .ls-wider { letter-spacing: 0.05em; }
    .ls-widest { letter-spacing: 0.1em; }
    .leading-relaxed { line-height: 1.8; }
    .hover-bg-light:hover { background-color: var(--surface-container-low) !important; }
  `]
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private dataService: MockDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dataService.getProductById(id).subscribe((p: Product | undefined) => this.product = p);
    }
  }
}

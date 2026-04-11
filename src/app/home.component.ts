import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar.component';
import { ProductCardComponent } from './shared/components/product-card.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner.component';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-vh-100">
      <!-- Hero Section -->
      <section class="hero-section py-5 mb-5" style="background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent), radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.05), transparent);">
        <div class="container pt-5">
          <div class="row align-items-center g-5">
            <div class="col-lg-6">
              <h1 class="display-3 fw-bold mb-3">
                Elevate Your <span class="gradient-text">Shopping</span> Experience
              </h1>
              <p class="lead text-secondary mb-4 pb-2">
                Discover a curated collection of premium products from top-tier vendors. Seamlessly browse, securely buy, and enjoy lightning-fast delivery.
              </p>
              <div class="d-flex gap-3">
                <button class="btn-premium px-4 py-3">Shop Collections</button>
                <button class="btn btn-outline-dark border-2 px-4 py-3 rounded-3 fw-bold">Become a Seller</button>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="position-relative">
                <div class="bg-primary opacity-10 position-absolute top-50 start-50 translate-middle rounded-circle" style="width: 120%; height: 120%; filter: blur(60px);"></div>
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800" alt="E-commerce Hero" class="img-fluid rounded-4 shadow-lg position-relative">
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="container pb-5">
        <section class="products-section">
          <div class="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 class="h1 fw-bold mb-2">Featured Products</h2>
              <p class="text-secondary mb-0">Our hand-picked selections for you today</p>
            </div>
            <button class="btn btn-link text-primary fw-bold text-decoration-none h5 mb-0">
              Browse All Products <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>

          <app-loading-spinner *ngIf="isLoading"></app-loading-spinner>

          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4" *ngIf="!isLoading">
            <div class="col" *ngFor="let prod of products">
              <app-product-card [product]="prod"></app-product-card>
            </div>
          </div>
          
          <div class="card-premium p-5 text-center mt-5" *ngIf="!isLoading && products.length === 0">
            <div class="mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 class="fw-bold">No products found</h3>
            <p class="text-secondary">Start by adding some in the Seller Dashboard!</p>
            <button class="btn-premium mt-3">Visit Dashboard</button>
          </div>
        </section>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  isLoading = true;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    // Junior Developer Note: We fetch products on init.
    // Since images are placeholders, we'll manually add some mock data if the API fails.
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: () => {
        // Fallback for demonstration
        this.products = [
          { name: 'Smartphone Pro', price: 999, description: 'Latest flagship model', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500' },
          { name: 'Wireless Earbuds', price: 199, description: 'Noise cancelling sound', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
          { name: 'Ultra HD Monitor', price: 450, description: '4K resolution display', imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500' },
          { name: 'Gaming Mouse', price: 89, description: 'RGB lighting and high DPI', imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500' }
        ];
        this.isLoading = false;
      }
    });
  }
}

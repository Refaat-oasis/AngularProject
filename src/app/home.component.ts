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
    <div class="bg-light min-vh-100">
      <div class="container py-5">
        <header class="text-center mb-5">
          <h1 class="display-4 fw-bold text-dark">Welcome to Our E-Store</h1>
          <p class="lead text-muted">A multi-vendor platform for all your needs.</p>
        </header>

        <section class="products-section">
          <div class="row align-items-center mb-4">
            <div class="col">
              <h2 class="h3 mb-0">Featured Products</h2>
            </div>
            <div class="col-auto">
              <button class="btn btn-link text-decoration-none fw-bold">View All &rarr;</button>
            </div>
          </div>

          <app-loading-spinner *ngIf="isLoading"></app-loading-spinner>

          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4" *ngIf="!isLoading">
            <div class="col" *ngFor="let prod of products">
              <app-product-card [product]="prod"></app-product-card>
            </div>
          </div>
          
          <div class="alert alert-info text-center py-4 mt-4" *ngIf="!isLoading && products.length === 0">
            <strong>No products found.</strong> Start by adding some in the Seller Dashboard!
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService, Product } from '../../services/mock-data.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid px-lg-5 pt-5 mt-5 max-w-7xl">
      <div class="mb-5 pb-3 border-bottom border-light">
        <h1 class="h2 fw-bold mb-2">Curated Collection</h1>
        <p class="text-secondary small">Manage your selections and proceed to acquisition</p>
      </div>
      
      <div class="row g-5">
        <!-- Cart Items -->
        <div class="col-lg-8">
          <div class="space-y-4" *ngIf="cartItems.length > 0; else emptyCart">
            <div class="merchant-card p-4 d-flex gap-4 align-items-center" *ngFor="let item of cartItems">
              <div class="item-img rounded-3 overflow-hidden bg-light" style="width: 120px; height: 120px;">
                <img [src]="item.imageUrl" class="w-100 h-100 object-fit-cover" [alt]="item.name">
              </div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h4 class="h6 fw-bold mb-1">{{ item.name }}</h4>
                    <p class="text-secondary-variant x-small uppercase ls-widest mb-0">{{ item.brand }} | {{ item.sku }}</p>
                  </div>
                  <button class="btn btn-link text-secondary p-0 hover-primary">
                    <span class="material-symbols-outlined fs-5">delete</span>
                  </button>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <div class="d-flex align-items-center gap-3 border rounded-pill px-3 py-1">
                    <button class="btn btn-link p-0 text-secondary fs-4 text-decoration-none">-</button>
                    <span class="fw-bold">1</span>
                    <button class="btn btn-link p-0 text-secondary fs-4 text-decoration-none">+</button>
                  </div>
                  <span class="fw-bold text-primary">{{ item.price | currency }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <ng-template #emptyCart>
            <div class="text-center py-5 bg-surface-container-low rounded-5 border border-dashed border-secondary/20">
              <span class="material-symbols-outlined text-secondary fs-large mb-3">shopping_basket</span>
              <h3 class="h5 fw-bold mb-2">Your collection is empty</h3>
              <p class="text-secondary small mb-4">Discover exceptional pieces in our shop</p>
              <button class="btn btn-primary-merchant px-5" routerLink="/products">Explore Collection</button>
            </div>
          </ng-template>
        </div>
        
        <!-- Summary Area -->
        <div class="col-lg-4">
          <div class="sticky-top" style="top: 100px;">
            <div class="merchant-card p-4 p-xl-5 bg-primary text-white border-0 shadow-lg">
              <h3 class="h5 fw-bold mb-4 font-headline border-bottom border-white/10 pb-3">Acquisition Summary</h3>
              
              <div class="space-y-4 mb-5">
                <div class="d-flex justify-content-between small opacity-70">
                  <span>Subtotal</span>
                  <span>{{ subtotal | currency }}</span>
                </div>
                <div class="d-flex justify-content-between small opacity-70">
                  <span>Merchant Logistics</span>
                  <span>{{ 150 | currency }}</span>
                </div>
                <div class="d-flex justify-content-between h5 fw-bold pt-3 border-top border-white/10">
                  <span>Total</span>
                  <span>{{ subtotal + 150 | currency }}</span>
                </div>
              </div>
              
              <button class="btn btn-light w-100 py-3 fw-bold mb-3 hover-secondary" [disabled]="cartItems.length === 0">
                Proceed to Checkout
              </button>
              <p class="text-center x-small opacity-50 mb-0">Secure payment via Artisan-approved Gateway</p>
            </div>
            
            <div class="mt-4 p-4 rounded-4 bg-surface-container-low border border-light">
              <p class="small text-secondary fw-medium mb-3">Accepted Payment Forms</p>
              <div class="d-flex gap-3 text-secondary opacity-50">
                <span class="material-symbols-outlined">credit_card</span>
                <span class="material-symbols-outlined">account_balance</span>
                <span class="material-symbols-outlined">payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .max-w-7xl { max-width: 1400px; margin: 0 auto; min-height: 80vh; }
    .text-secondary-variant { color: var(--on-surface-variant); }
    .x-small { font-size: 0.65rem; }
    .ls-widest { letter-spacing: 0.1em; }
    .fs-large { font-size: 4rem; }
    .border-dashed { border-style: dashed !important; }
    .hover-primary:hover { color: var(--primary) !important; }
    .hover-secondary:hover { background-color: var(--secondary-container) !important; color: var(--on-secondary-container) !important; border-color: transparent; }
  `]
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  subtotal: number = 0;

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getProducts().subscribe((prods: Product[]) => {
      // Mocking first 2 items as being in cart
      this.cartItems = prods.slice(0, 2);
      this.calculateSubtotal();
    });
  }

  calculateSubtotal() {
    this.subtotal = this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { OrderResponse } from '../../models/interfaces';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="page-wrapper container px-lg-5 pt-5 mt-5">
      <header class="mb-5 pb-3">
        <h1 class="h2 fw-bold mb-0 text-theme-primary">My Order History</h1>
        <p class="text-theme-variant">Review and track your previous purchases</p>
      </header>

      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      }

      @if (!loading() && orders().length === 0) {
        <div class="text-center py-5 bg-theme-surface rounded-lg shadow-sm border-theme">
          <span class="material-symbols-outlined fs-1 text-theme-variant mb-3" style="font-size: 4rem;">receipt_long</span>
          <h3 class="h5 fw-bold text-theme-primary">No orders found</h3>
          <p class="text-theme-variant">You haven't placed any orders yet.</p>
          <button class="btn btn-primary-merchant mt-3 px-5 py-2 rounded-pill" (click)="goToShop()">
            Start Shopping
          </button>
        </div>
      }

      @if (!loading() && orders().length > 0) {
        <div class="order-list d-grid gap-4">
          @for (order of orders(); track order.id) {
            <div class="order-card card border-0 shadow-sm bg-theme-surface rounded-lg overflow-hidden transition-all hover-lift border-theme">
              <div class="card-header bg-theme-surface border-bottom border-theme p-4 d-flex justify-content-between align-items-center">
                <div>
                  <span class="text-theme-variant small fw-bold text-uppercase">Order #{{ order.id }}</span>
                  <div class="text-theme-primary small mt-1">{{ order.orderDate | date:'mediumDate' }}</div>
                </div>
                <div class="status-badge px-3 py-1 rounded-pill small fw-bold" [ngClass]="getStatusClass(order.status)">
                  {{ order.status }}
                </div>
              </div>

              <div class="card-body p-4">
                <div class="order-items mb-4">
                  @for (item of order.items; track item.productName) {
                    <div class="order-item d-flex justify-content-between py-2 border-bottom border-theme last-border-none">
                      <div class="d-flex align-items-center gap-3">
                        <div class="item-info">
                          <div class="text-theme-primary fw-medium">{{ item.productName }}</div>
                          <div class="text-theme-variant small">Qty: {{ item.quantity }} × {{ item.price | currency }}</div>
                        </div>
                      </div>
                      <div class="text-theme-primary fw-bold">{{ item.subtotal | currency }}</div>
                    </div>
                  }
                </div>

                <div class="d-flex justify-content-between align-items-end pt-2">
                  <div class="shipping-info">
                    <div class="text-theme-variant small fw-bold text-uppercase mb-1">Shipping To</div>
                    <div class="text-theme-primary small">{{ order.shippingAddress }}</div>
                  </div>
                  <div class="order-total text-end">
                    <div class="text-theme-variant small">Total Amount</div>
                    <div class="text-primary h4 fw-bold mb-0">{{ order.total | currency }}</div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important; }
    .last-border-none:last-child { border-bottom: none !important; }
    .status-processing { background-color: var(--secondary-container); color: var(--on-secondary-container); }
    .status-shipped { background-color: #E3F2FD; color: #1565C0; }
    .status-delivered { background-color: #E8F5E9; color: #2E7D32; }
    .status-cancelled { background-color: #FFEBEE; color: #C62828; }
    .border-theme { border-bottom: 1px solid var(--outline-variant); }
  `]
})
export class MyOrdersComponent implements OnInit {
  orders = signal<OrderResponse[]>([]);
  loading = signal(false);

  private orderService = inject(OrderService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService.getUserOrders().pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.orders.set([...data].sort((a, b) => b.id - a.id));
        } else {
          this.orders.set([]);
        }
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.orders.set([]);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Processing': return 'status-processing';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-processing';
    }
  }

  goToShop() {
    this.router.navigate(['/']);
  }
}

import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { OrderResponse } from '../../models/interfaces';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
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

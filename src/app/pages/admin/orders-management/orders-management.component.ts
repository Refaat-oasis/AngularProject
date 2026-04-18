import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { OrderResponse } from '../../../models/interfaces';
import {
  AdminOrdersService,
  UpdateOrderStatusResponse
} from '../../../services/admin-orders.service';

type OrderStatusFilter = 'all' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './orders-management.component.html',
  styleUrl: './orders-management.component.css'
})
export class OrdersManagementComponent implements OnInit {
  readonly availableStatuses: Exclude<OrderStatusFilter, 'all'>[] = [
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  orders: OrderResponse[] = [];
  searchTerm = '';
  statusFilter: OrderStatusFilter = 'all';
  loading = false;
  error: string | null = null;
  success: string | null = null;
  updatingOrderId: number | null = null;

  showDetailsModal = false;
  detailsLoading = false;
  selectedOrder: OrderResponse | null = null;

  constructor(
    private adminOrdersService: AdminOrdersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  get filteredOrders(): OrderResponse[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.orders.filter((order) => {
      const matchesSearch =
        !term ||
        String(order.id).includes(term) ||
        order.shippingAddress.toLowerCase().includes(term) ||
        order.paymentMethod.toLowerCase().includes(term) ||
        order.items.some((item) => item.productName.toLowerCase().includes(term));

      const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  get totalRevenue(): number {
    return this.filteredOrders
      .filter((order) => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total, 0);
  }

  get processingCount(): number {
    return this.orders.filter((order) => order.status === 'Processing').length;
  }

  get shippedCount(): number {
    return this.orders.filter((order) => order.status === 'Shipped').length;
  }

  get deliveredCount(): number {
    return this.orders.filter((order) => order.status === 'Delivered').length;
  }

  get cancelledCount(): number {
    return this.orders.filter((order) => order.status === 'Cancelled').length;
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.adminOrdersService.getAllOrders()
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.cdr.detectChanges();
        },
        error: (error: unknown) => {
          console.error(error);
          this.error = 'Failed to load orders.';
          this.cdr.detectChanges();
        }
      });
  }

  trackByOrderId(index: number, order: OrderResponse): number {
    return order.id;
  }

  openDetails(order: OrderResponse): void {
    this.showDetailsModal = true;
    this.detailsLoading = true;
    this.selectedOrder = null;

    this.adminOrdersService.getOrderDetails(order.id)
      .pipe(finalize(() => {
        this.detailsLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (details) => {
          this.selectedOrder = details;
          this.cdr.detectChanges();
        },
        error: (error: unknown) => {
          console.error(error);
          this.error = 'Failed to load order details.';
          this.closeDetails();
          this.cdr.detectChanges();
        }
      });
  }

  closeDetails(): void {
    this.showDetailsModal = false;
    this.detailsLoading = false;
    this.selectedOrder = null;
  }

  updateStatus(order: OrderResponse, status: string): void {
    if (!status || status === order.status) {
      return;
    }

    this.updatingOrderId = order.id;
    this.error = null;
    this.success = null;

    this.adminOrdersService.updateOrderStatus(order.id, { status })
      .pipe(finalize(() => {
        this.updatingOrderId = null;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (response: UpdateOrderStatusResponse) => {
          const nextStatus = response.status || status;
          this.orders = this.orders.map((item) =>
            item.id === order.id ? { ...item, status: nextStatus } : item
          );

          if (this.selectedOrder?.id === order.id) {
            this.selectedOrder = { ...this.selectedOrder, status: nextStatus };
          }

          this.success = response.message || `Order #${order.id} updated to ${nextStatus}.`;
          this.cdr.detectChanges();
        },
        error: (error: unknown) => {
          console.error(error);
          this.error = `Failed to update order #${order.id}.`;
          this.cdr.detectChanges();
        }
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'Shipped':
        return 'status-shipped';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-processing';
    }
  }
}

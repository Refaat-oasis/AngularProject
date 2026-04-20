import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  orders = signal<OrderResponse[]>([]);
  searchTerm = signal('');
  statusFilter = signal<OrderStatusFilter>('all');
  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);
  updatingOrderId = signal<number | null>(null);

  showDetailsModal = signal(false);
  detailsLoading = signal(false);
  selectedOrder = signal<OrderResponse | null>(null);

  filteredOrders = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.orders().filter((order) => {
      const matchesSearch =
        !term ||
        String(order.id).includes(term) ||
        order.shippingAddress.toLowerCase().includes(term) ||
        order.paymentMethod.toLowerCase().includes(term) ||
        order.items.some((item) => item.productName.toLowerCase().includes(term));

      const matchesStatus = this.statusFilter() === 'all' || order.status === this.statusFilter();
      return matchesSearch && matchesStatus;
    });
  });

  totalRevenue = computed(() =>
    this.filteredOrders()
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0)
  );
  processingCount = computed(() => this.orders().filter((o) => o.status === 'Processing').length);
  shippedCount = computed(() => this.orders().filter((o) => o.status === 'Shipped').length);
  deliveredCount = computed(() => this.orders().filter((o) => o.status === 'Delivered').length);
  cancelledCount = computed(() => this.orders().filter((o) => o.status === 'Cancelled').length);

  constructor(private adminOrdersService: AdminOrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.adminOrdersService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  trackByOrderId(index: number, order: OrderResponse): number {
    return order.id;
  }

  openDetails(order: OrderResponse): void {
    this.showDetailsModal.set(true);
    this.detailsLoading.set(true);
    this.selectedOrder.set(null);

    this.adminOrdersService.getOrderDetails(order.id).subscribe({
      next: (details) => {
        this.selectedOrder.set(details);
        this.detailsLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.closeDetails();
      }
    });
  }

  closeDetails(): void {
    this.showDetailsModal.set(false);
    this.detailsLoading.set(false);
    this.selectedOrder.set(null);
  }

  updateStatus(order: OrderResponse, status: string): void {
    if (!status || status === order.status) return;

    this.updatingOrderId.set(order.id);
    this.success.set(null);

    this.adminOrdersService.updateOrderStatus(order.id, { status }).subscribe({
      next: (response: UpdateOrderStatusResponse) => {
        const nextStatus = response.status || status;
        this.orders.update((list) =>
          list.map((item) => item.id === order.id ? { ...item, status: nextStatus } : item)
        );

        const current = this.selectedOrder();
        if (current?.id === order.id) {
          this.selectedOrder.set({ ...current, status: nextStatus });
        }

        this.success.set(response.message || `Order #${order.id} updated to ${nextStatus}.`);
        this.updatingOrderId.set(null);
      },
      error: (err) => {
        console.error(err);
        this.updatingOrderId.set(null);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered': return 'status-delivered';
      case 'Shipped': return 'status-shipped';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-processing';
    }
  }
}

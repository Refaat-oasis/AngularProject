import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IProduct } from '../../../models/iproduct';
import { ProductService } from '../../../services/product-service';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {

  products = signal<IProduct[]>([]);
  loading = signal(false);
  baseUrl = 'http://localhost:5118';
  selectedId!: number;

  public router = inject(Router);
  private productService = inject(ProductService);

  constructor() {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getMyProducts().subscribe({
      next: (res) => {
        this.products.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  delete(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;
    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error(err)
    });
  }

  openConfirm(id: number): void {
    this.selectedId = id;
  }

  confirmDelete(): void {
    this.productService.delete(this.selectedId).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error(err)
    });
  }
}

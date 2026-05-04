import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IProduct } from '../../../models/iproduct';
import { ProductService } from '../../../services/product-service';
import { environment } from '../../../environment';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsListComponent implements OnInit {

  products = signal<IProduct[]>([]);
  loading = signal(false);
  baseUrl = environment.baseUrl;
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

  getImageUrl(product: IProduct | null | undefined): string {
    const fallbackImage = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720"><rect width="600" height="720" fill="#f7fafc"/><circle cx="220" cy="240" r="54" fill="#cbd5e0"/><path d="M100 560l120-118 92 76 92-112 96 154H100z" fill="#a0aec0"/><text x="300" y="650" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#4a5568">No Image</text></svg>'
    );
    if (!product) return fallbackImage;
    const rawPath = product.imageUrl || product.image;
    if (!rawPath) return fallbackImage;
    const path = rawPath.replace(/\\/g, '/').trim();
    if (path.startsWith('data:image') || path.startsWith('http')) return path;
    if (path.startsWith('/images/')) return path;
    if (path.startsWith('images/')) return `/${path}`;
    if (!path.includes('/')) return `/images/products/${path}`;
    return path.startsWith('/') ? `${this.baseUrl}${path}` : `${this.baseUrl}/${path}`;
  }
}

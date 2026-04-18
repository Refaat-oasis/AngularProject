import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminProduct } from '../../../models/admin-product.models';
import { AdminProductsService } from '../../../services/admin-products.service';
import { CategoryService } from '../../../services/category-service';
import { Icategory } from '../../../models/icategory';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './products-management.component.html',
  styleUrl: './products-management.component.css'
})
export class ProductsManagementComponent implements OnInit {
  products: AdminProduct[] = [];
  categories: Icategory[] = [];
  searchTerm = '';
  statusFilter: 'all' | 'active' | 'deleted' = 'all';
  loading = false;
  error: string | null = null;
  feedback: string | null = null;
  readonly imageBaseUrl = 'http://localhost:5118';
  readonly fallbackImage =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" fill="#edf2f7"/>' +
        '<circle cx="220" cy="150" r="44" fill="#cbd5e0"/>' +
        '<path d="M120 320l110-100 70 58 64-76 116 118H120z" fill="#a0aec0"/>' +
        '<text x="300" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#4a5568">No Image</text>' +
      '</svg>'
    );

  constructor(
    private adminProductsService: AdminProductsService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.adminProductsService.getAllForAdmin()
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.cdr.detectChanges();
        },
        error: (error: unknown) => {
          console.error(error);
          this.error = 'Failed to load products.';
          this.cdr.detectChanges();
        }
      });
  }

  trackByProductId(index: number, product: AdminProduct): number {
    return product.id;
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error(error);
      }
    });
  }

  get filteredProducts(): AdminProduct[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        String(product.id).includes(term);

      const isDeleted = !!product.isDeleted;
      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && !isDeleted) ||
        (this.statusFilter === 'deleted' && isDeleted);

      return matchesSearch && matchesStatus;
    });
  }

  get activeCount(): number {
    return this.products.filter((product) => !product.isDeleted).length;
  }

  get deletedCount(): number {
    return this.products.filter((product) => !!product.isDeleted).length;
  }

  get totalStock(): number {
    return this.filteredProducts.reduce((sum, product) => sum + product.stock, 0);
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find((category) => category.id === categoryId)?.name ?? `#${categoryId}`;
  }

  deleteProduct(product: AdminProduct): void {
    if (!window.confirm(`Delete ${product.name}?`)) {
      return;
    }

    this.feedback = null;
    this.adminProductsService.delete(product.id).subscribe({
      next: () => {
        this.products = this.products.map((item) =>
          item.id === product.id ? { ...item, isDeleted: true } : item
        );
        this.feedback = `${product.name} was deleted successfully.`;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error(error);
        this.error = 'Failed to delete product.';
        this.cdr.detectChanges();
      }
    });
  }

  reactivateProduct(product: AdminProduct): void {
    this.feedback = null;
    this.error = null;

    this.adminProductsService.reactivate(product.id).subscribe({
      next: (response) => {
        this.products = this.products.map((item) =>
          item.id === product.id
            ? { ...item, isDeleted: response.product?.isDeleted ?? false }
            : item
        );
        this.feedback = response.message || `${product.name} was reactivated successfully.`;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error(error);
        this.error = 'Failed to reactivate product.';
        this.cdr.detectChanges();
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) {
      return this.fallbackImage;
    }

    if (path.startsWith('data:image') || path.startsWith('http')) {
      return path;
    }

    return path.startsWith('/') ? `${this.imageBaseUrl}${path}` : `${this.imageBaseUrl}/${path}`;
  }

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image || image.src === this.fallbackImage) {
      return;
    }

    image.src = this.fallbackImage;
  }
}

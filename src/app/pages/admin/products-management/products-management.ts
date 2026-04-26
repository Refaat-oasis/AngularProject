import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminProduct } from '../../../models/admin-product.models';
import { AdminProductsService } from '../../../services/admin-products.service';
import { CategoryService } from '../../../services/category-service';
import { ICategory } from '../../../models/icategory';
import { environment } from '../../../environment';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './products-management.html',
  styleUrl: './products-management.css'
})
export class ProductsManagementComponent implements OnInit {
  products = signal<AdminProduct[]>([]);
  categories = signal<ICategory[]>([]);
  searchTerm = signal('');
  statusFilter = signal<'all' | 'active' | 'deleted'>('all');
  loading = signal(false);
  feedback = signal<string | null>(null);
  error = signal<string | null>(null);
  readonly imageBaseUrl = environment.baseUrl;
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

  filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.products().filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        String(product.id).includes(term);

      const isDeleted = !!product.isDeleted;
      const matchesStatus =
        this.statusFilter() === 'all' ||
        (this.statusFilter() === 'active' && !isDeleted) ||
        (this.statusFilter() === 'deleted' && isDeleted);

      return matchesSearch && matchesStatus;
    });
  });

  activeCount = computed(() => this.products().filter((p) => !p.isDeleted).length);
  deletedCount = computed(() => this.products().filter((p) => !!p.isDeleted).length);
  totalStock = computed(() => this.filteredProducts().reduce((sum, p) => sum + p.stock, 0));

  constructor(
    private adminProductsService: AdminProductsService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.adminProductsService.getAllForAdmin().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => console.error(err)
    });
  }

  trackByProductId(index: number, product: AdminProduct): number {
    return product.id;
  }

  getCategoryName(categoryId: number): string {
    return this.categories().find((c) => c.id === categoryId)?.name ?? `#${categoryId}`;
  }

  deleteProduct(product: AdminProduct): void {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    this.feedback.set(null);
    this.adminProductsService.delete(product.id).subscribe({
      next: () => {
        this.products.update((list) =>
          list.map((item) => item.id === product.id ? { ...item, isDeleted: true } : item)
        );
        this.feedback.set(`${product.name} was deleted successfully.`);
      },
      error: (err) => console.error(err)
    });
  }

  reactivateProduct(product: AdminProduct): void {
    this.feedback.set(null);
    this.adminProductsService.reactivate(product.id).subscribe({
      next: (response) => {
        this.products.update((list) =>
          list.map((item) =>
            item.id === product.id
              ? { ...item, isDeleted: response.product?.isDeleted ?? false }
              : item
          )
        );
        this.feedback.set(response.message || `${product.name} was reactivated successfully.`);
      },
      error: (err) => console.error(err)
    });
  }

  getImageUrl(product: AdminProduct | null | undefined): string {
    if (!product) return this.fallbackImage;
    const path = product.imageUrl || product.image;
    if (!path) return this.fallbackImage;
    if (path.startsWith('data:image') || path.startsWith('http')) return path;
    // Bare filename with no path separator (e.g. "product.jpg") → unresolvable
    if (!path.includes('/')) return this.fallbackImage;
    return path.startsWith('/') ? `${this.imageBaseUrl}${path}` : `${this.imageBaseUrl}/${path}`;
  }

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image || image.src === this.fallbackImage) return;
    image.src = this.fallbackImage;
  }
}


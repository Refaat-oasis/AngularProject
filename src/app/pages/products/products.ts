import { Component, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IProduct } from '../../models/iproduct';
import { ProductService } from '../../services/product-service';
import { RouterLink } from '@angular/router';
import { Icategory } from '../../models/icategory';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { environment } from '../../environment';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  products = signal<IProduct[]>([]);
  loading = signal(false);
  categories = signal<Icategory[]>([]);
  readonly imageBaseUrl = environment.baseUrl;
  readonly fallbackImage =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720">' +
        '<rect width="600" height="720" fill="#f7fafc"/>' +
        '<circle cx="220" cy="240" r="54" fill="#cbd5e0"/>' +
        '<path d="M100 560l120-118 92 76 92-112 96 154H100z" fill="#a0aec0"/>' +
        '<text x="300" y="650" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#4a5568">No Image</text>' +
      '</svg>'
    );

  hasProducts = computed(() => this.products().length > 0);
  isReady = computed(() => !this.loading());

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error(err)
    });
  }

  loadProducts(): void {
    this.route.queryParams.pipe(
      switchMap(params => {
        const search = params['search'];
        this.loading.set(true);
        if (search && search.trim() !== '') {
          return this.productService.search(search);
        }
        return this.productService.getAll();
      })
    ).subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  loadCategoryProducts(categoryId: number): void {
    this.loading.set(true);
    this.categoryService.getByCategory(categoryId).subscribe({
      next: (data) => {
        this.products.set(data.products);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  getImageUrl(path: string | null | undefined): string {
    if (!path) return this.fallbackImage;
    if (path.startsWith('data:image') || path.startsWith('http')) return path;
    return path.startsWith('/') ? `${this.imageBaseUrl}${path}` : `${this.imageBaseUrl}/${path}`;
  }

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image || image.src === this.fallbackImage) return;
    image.src = this.fallbackImage;
  }
}


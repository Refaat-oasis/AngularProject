import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { IProduct } from '../../../../models/iproduct';
import { ProductService } from '../../../../services/product-service';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environment';
import { CartService } from '../../../../services/cart.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-trending-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './trending-products.html',
  styleUrl: './trending-products.css'
})
export class TrendingProductsComponent implements OnInit {

  products = signal<IProduct[]>([]);
  loading = signal(false);
  addingProductId = signal<number | null>(null);

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

  constructor(private dataService: ProductService, public cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.dataService.getAll().subscribe({
      next: (res: IProduct[]) => {
        this.products.set(res.slice(0, 4));
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  getImageUrl(product: IProduct | null | undefined): string {
    if (!product) return this.fallbackImage;
    const path = product.imageUrl || product.image;
    if (!path) return this.fallbackImage;

    if (path.startsWith('data:image') || path.startsWith('http')) {
      return path;
    }

    // Bare filename with no path separator (e.g. "product.jpg") → unresolvable
    if (!path.includes('/')) return this.fallbackImage;

    return path.startsWith('/')
      ? `${this.imageBaseUrl}${path}`
      : `${this.imageBaseUrl}/${path}`;
  }

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.src !== this.fallbackImage) {
      image.src = this.fallbackImage;
    }
  }

  addToCart(product: IProduct, event: Event): void {
    event.stopPropagation();
    this.addingProductId.set(product.id);

    this.cartService.addToCart(product.id, 1).pipe(
      finalize(() => this.addingProductId.set(null))
    ).subscribe({
      error: (error) => console.error('Failed to add product to cart', error)
    });
  }
}

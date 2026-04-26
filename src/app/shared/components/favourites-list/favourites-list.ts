import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../environment';
import { IProduct } from '../../../models/iproduct';
import { CartService } from '../../../services/cart.service';
import { FavouritesService } from '../../../services/favourites.service';

@Component({
  selector: 'app-favourites-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './favourites-list.html',
  styleUrl: './favourites-list.css'
})
export class FavouritesListComponent {
  readonly favouritesService = inject(FavouritesService);
  private readonly cartService = inject(CartService);

  readonly favourites = this.favouritesService.favourites;
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

  readonly addingProductId = signal<number | null>(null);
  readonly cartFeedback = signal('');
  readonly feedbackTone = signal<'success' | 'error'>('success');
  readonly feedbackClass = computed(() =>
    this.feedbackTone() === 'success' ? 'alert-success' : 'alert-danger'
  );

  addToCart(product: IProduct): void {
    this.addingProductId.set(product.id);
    this.cartFeedback.set('');

    this.cartService.addToCart(product.id, 1).pipe(
      finalize(() => this.addingProductId.set(null))
    ).subscribe({
      next: () => {
        this.feedbackTone.set('success');
        this.cartFeedback.set(`${product.name} was added to your cart.`);
      },
      error: (error) => {
        this.feedbackTone.set('error');
        this.cartFeedback.set(error.error?.message || `We could not add ${product.name} to the cart right now.`);
      }
    });
  }

  remove(productId: number): void {
    this.favouritesService.remove(productId);
  }

  clearAll(): void {
    this.favouritesService.clear();
  }

  getImageUrl(product: IProduct | null | undefined): string {
    if (!product) {
      return this.fallbackImage;
    }

    const path = product.imageUrl || product.image;
    if (!path) {
      return this.fallbackImage;
    }

    if (path.startsWith('data:image') || path.startsWith('http')) {
      return path;
    }

    if (!path.includes('/')) {
      return this.fallbackImage;
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

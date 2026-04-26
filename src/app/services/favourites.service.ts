import { Injectable, computed, signal } from '@angular/core';
import { IProduct } from '../models/iproduct';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private readonly storageKey = 'favourite-products';

  // Store a product snapshot locally so the favourites view stays responsive offline.
  readonly favourites = signal<IProduct[]>(this.readStoredFavourites());
  readonly favouritesCount = computed(() => this.favourites().length);

  add(product: IProduct): void {
    if (this.isFavourite(product.id)) {
      return;
    }

    this.persist([this.toStoredProduct(product), ...this.favourites()]);
  }

  remove(productId: number): void {
    this.persist(this.favourites().filter(product => product.id !== productId));
  }

  clear(): void {
    this.persist([]);
  }

  toggle(product: IProduct): boolean {
    if (this.isFavourite(product.id)) {
      this.remove(product.id);
      return false;
    }

    this.add(product);
    return true;
  }

  isFavourite(productId: number): boolean {
    return this.favourites().some(product => product.id === productId);
  }

  private persist(favourites: IProduct[]): void {
    this.favourites.set(favourites);
    localStorage.setItem(this.storageKey, JSON.stringify(favourites));
  }

  private readStoredFavourites(): IProduct[] {
    try {
      const storedValue = localStorage.getItem(this.storageKey);
      if (!storedValue) {
        return [];
      }

      const parsed = JSON.parse(storedValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private toStoredProduct(product: IProduct): IProduct {
    return {
      ...product,
      imageUrl: product.imageUrl || product.image
    };
  }
}

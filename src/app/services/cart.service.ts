import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';
import { CartItemResponse } from '../models/interfaces';
import { AuthService } from './auth.service';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = `${environment.apiUrl}/cart`;
  private readonly guestCartKey = 'guestCart';
  
  private cartItemsSubject = new BehaviorSubject<CartItemResponse[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  
  cartCount$ = this.cartItems$.pipe(
    map(items => items.reduce((total, item) => total + item.quantity, 0))
  );

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadCart();
  }

  private buildProductImage(product: any): string {
    const rawPath = product?.image ?? product?.imageUrl ?? '';
    if (!rawPath) return '';
    const imagePath = String(rawPath).replace(/\\/g, '/').trim();
    if (imagePath.startsWith('http') || imagePath.startsWith('data:image')) return imagePath;
    if (imagePath.startsWith('/images/')) return imagePath;
    if (imagePath.startsWith('images/')) return `/${imagePath}`;
    if (!imagePath.includes('/')) return `/images/products/${imagePath}`;
    return imagePath.startsWith('/') ? `${environment.baseUrl}${imagePath}` : `${environment.baseUrl}/${imagePath}`;
  }

  loadCart() {
    if (this.authService.isLoggedIn()) {
      this.fetchServerCart().subscribe({
        next: (items) => this.setCartState(items, false),
        error: (err) => console.error('Failed to load cart', err)
      });
    } else {
      this.setCartState(this.readGuestCart(), true);
    }
  }

  addToCart(productId: number, quantity: number = 1): Observable<CartItemResponse[]> {
    if (this.authService.isLoggedIn()) {
      return this.http.post(`${this.baseUrl}/add`, { productId, quantity }).pipe(
        switchMap(() => this.fetchServerCart()),
        tap(items => this.setCartState(items, false))
      );
    }

    const currentCart = [...this.cartItemsSubject.value];
    const existingItem = currentCart.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * existingItem.productPrice;

      const updatedCart = this.normalizeCartItems(currentCart);
      this.setCartState(updatedCart, true);
      return of(updatedCart);
    }

    return this.http.get<any>(`${environment.apiUrl}/products/${productId}`).pipe(
      map(product => {
        const newItem: CartItemResponse = {
          id: Date.now(),
          productId: product.id,
          productName: product.name,
          productImage: this.buildProductImage(product),
          productPrice: product.price,
          quantity,
          subtotal: product.price * quantity
        };

        return this.normalizeCartItems([...currentCart, newItem]);
      }),
      tap(items => this.setCartState(items, true))
    );
  }

  updateQuantity(cartItemId: number, quantity: number): Observable<CartItemResponse[]> {
    if (this.authService.isLoggedIn()) {
      return this.http.put(`${this.baseUrl}/${cartItemId}`, { quantity }).pipe(
        switchMap(() => this.fetchServerCart()),
        tap(items => this.setCartState(items, false))
      );
    }

    const currentCart = [...this.cartItemsSubject.value];
    const item = currentCart.find(cartItem => cartItem.id === cartItemId);
    if (!item) {
      return of(this.cartItemsSubject.value);
    }

    item.quantity = quantity;
    item.subtotal = item.quantity * item.productPrice;

    const updatedCart = this.normalizeCartItems(currentCart);
    this.setCartState(updatedCart, true);
    return of(updatedCart);
  }

  removeItem(cartItemId: number): Observable<CartItemResponse[]> {
    if (this.authService.isLoggedIn()) {
      return this.http.delete(`${this.baseUrl}/${cartItemId}`).pipe(
        switchMap(() => this.fetchServerCart()),
        tap(items => this.setCartState(items, false))
      );
    }

    const currentCart = this.cartItemsSubject.value.filter(item => item.id !== cartItemId);
    this.setCartState(currentCart, true);
    return of(currentCart);
  }

  clearCart(): Observable<CartItemResponse[]> {
    if (this.authService.isLoggedIn()) {
      return this.http.delete(`${this.baseUrl}/clear`).pipe(
        switchMap(() => this.fetchServerCart()),
        tap(items => this.setCartState(items, false))
      );
    }

    this.setCartState([], true);
    return of([]);
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.subtotal, 0);
  }

  private fetchServerCart(): Observable<CartItemResponse[]> {
    return this.http.get<CartItemResponse[]>(this.baseUrl).pipe(
      map(items => this.normalizeCartItems(items))
    );
  }

  private normalizeCartItems(items: CartItemResponse[]): CartItemResponse[] {
    return items.map(item => ({
      ...item,
      productImage: this.buildProductImage({ image: item.productImage })
    }));
  }

  private setCartState(items: CartItemResponse[], persistGuestCart: boolean): void {
    this.cartItemsSubject.next(items);

    if (persistGuestCart) {
      if (items.length === 0) {
        localStorage.removeItem(this.guestCartKey);
        return;
      }

      localStorage.setItem(this.guestCartKey, JSON.stringify(items));
      return;
    }

    localStorage.removeItem(this.guestCartKey);
  }

  private readGuestCart(): CartItemResponse[] {
    try {
      const savedCart = localStorage.getItem(this.guestCartKey);
      if (!savedCart) {
        return [];
      }

      const parsed = JSON.parse(savedCart);
      return Array.isArray(parsed) ? this.normalizeCartItems(parsed) : [];
    } catch {
      return [];
    }
  }
}

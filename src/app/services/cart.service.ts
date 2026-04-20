import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CartItemResponse } from '../models/interfaces';
import { AuthService } from './auth.service';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = `${environment.apiUrl}/cart`;
  
  private cartItemsSubject = new BehaviorSubject<CartItemResponse[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  
  cartCount$ = this.cartItems$.pipe(
    map(items => items.reduce((total, item) => total + item.quantity, 0))
  );

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadCart();
  }

  private buildProductImage(product: any): string {
    const imagePath = product?.image ?? product?.imageUrl ?? '';
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:image')) return imagePath;
    return imagePath.startsWith('/') ? `${environment.baseUrl}${imagePath}` : `${environment.baseUrl}/${imagePath}`;
  }

  loadCart() {
    if (this.authService.isLoggedIn()) {
      this.http.get<CartItemResponse[]>(this.baseUrl).subscribe({
        next: (items) => this.cartItemsSubject.next(items),
        error: (err) => console.error('Failed to load cart', err)
      });
    } else {
      // Guest cart
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        this.cartItemsSubject.next(JSON.parse(savedCart));
      }
    }
  }

  addToCart(productId: number, quantity: number = 1): void {
    if (this.authService.isLoggedIn()) {
      this.http.post(`${this.baseUrl}/add`, { productId, quantity }).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Failed to add to cart', err)
      });
    } else {
      // Guest logic
      const currentCart = this.cartItemsSubject.value;
      const existingItem = currentCart.find(i => i.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.productPrice;
      } else {
        // We lack product details here without an extra API call for guests, 
        // to simplify for guests, we'd need minimal details. But since guest checkout
        // uses localStorage we simulate it:
        // Actually, for a fully working guest, let's just make a product API call to get details
        this.http.get<any>(`${environment.apiUrl}/products/${productId}`).subscribe(product => {
          const newItem: CartItemResponse = {
            id: Date.now(), // fake id
            productId: product.id,
            productName: product.name,
            productImage: this.buildProductImage(product),
            productPrice: product.price,
            quantity: quantity,
            subtotal: product.price * quantity
          };
          const newCart = [...this.cartItemsSubject.value, newItem];
          this.cartItemsSubject.next(newCart);
          this.saveGuestCart(newCart);
        });
        return;
      }
      this.cartItemsSubject.next([...currentCart]);
      this.saveGuestCart(currentCart);
    }
  }

  updateQuantity(cartItemId: number, quantity: number): void {
    if (this.authService.isLoggedIn()) {
      this.http.put(`${this.baseUrl}/${cartItemId}`, { quantity }).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Failed to update quantity', err)
      });
    } else {
      const currentCart = this.cartItemsSubject.value;
      const item = currentCart.find(i => i.id === cartItemId);
      if (item) {
        item.quantity = quantity;
        item.subtotal = item.quantity * item.productPrice;
        this.cartItemsSubject.next([...currentCart]);
        this.saveGuestCart(currentCart);
      }
    }
  }

  removeItem(cartItemId: number): void {
    if (this.authService.isLoggedIn()) {
      this.http.delete(`${this.baseUrl}/${cartItemId}`).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Failed to remove item', err)
      });
    } else {
      const currentCart = this.cartItemsSubject.value.filter(i => i.id !== cartItemId);
      this.cartItemsSubject.next(currentCart);
      this.saveGuestCart(currentCart);
    }
  }

  clearCart(): void {
    if (this.authService.isLoggedIn()) {
      this.http.delete(`${this.baseUrl}/clear`).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Failed to clear cart', err)
      });
    } else {
      this.cartItemsSubject.next([]);
      localStorage.removeItem('guestCart');
    }
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.subtotal, 0);
  }

  private saveGuestCart(cart: CartItemResponse[]) {
    localStorage.setItem('guestCart', JSON.stringify(cart));
  }
}

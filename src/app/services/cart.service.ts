import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // We'll use a BehaviorSubject to keep the cart state updated across the app
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    // Junior Tip: Load existing cart from localStorage on startup
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  addToCart(product: any) {
    const currentItems = this.cartItems.value;
    const updatedItems = [...currentItems, product];
    this.cartItems.next(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  }

  getCartTotal() {
    return this.cartItems.value.reduce((total, item) => total + item.price, 0);
  }

  clearCart() {
    this.cartItems.next([]);
    localStorage.removeItem('cart');
  }
}

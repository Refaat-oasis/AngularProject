import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItemResponse } from '../../models/interfaces';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItemResponse[] = [];
  subtotal = 0;
  shippingCost = 0;
  actionError = '';
  private sub = new Subscription();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.sub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.subtotal = this.cartService.getCartTotal();
      this.shippingCost = this.subtotal > 50 ? 0 : 9.99;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  updateQuantity(item: CartItemResponse, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      this.actionError = '';
      this.cartService.updateQuantity(item.id, newQuantity).subscribe({
        error: (error) => {
          this.actionError = error.error?.message || 'We could not update that cart item.';
        }
      });
    }
  }

  removeItem(id: number) {
    this.actionError = '';
    this.cartService.removeItem(id).subscribe({
      error: () => {
        this.actionError = 'We could not remove that item right now.';
      }
    });
  }

  clearCart() {
    this.actionError = '';
    this.cartService.clearCart().subscribe({
      error: () => {
        this.actionError = 'We could not clear the cart right now.';
      }
    });
  }
}

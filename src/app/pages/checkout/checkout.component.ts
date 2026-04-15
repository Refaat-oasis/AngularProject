import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { CheckoutRequest, CartItemResponse } from '../../models/interfaces';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid px-lg-5 pt-5 mt-5 max-w-7xl">
      <div class="mb-5 pb-3 border-bottom border-light">
        <h1 class="h2 fw-bold mb-2">Checkout Details</h1>
        <p class="text-secondary small">Finalize your acquisition</p>
      </div>

      <div class="row g-5" *ngIf="!orderComplete">
        <!-- Steps -->
        <div class="col-lg-7 space-y-4">
          <!-- Step 1: Shipping Information -->
          <div class="merchant-card p-4 p-xl-5">
            <h3 class="h5 fw-bold mb-4 font-headline d-flex align-items-center gap-2">
              <span class="material-symbols-outlined text-primary">local_shipping</span>
              1. Shipping Information
            </h3>
            <form [formGroup]="shippingForm">
              <div class="row g-3">
                <div class="col-md-6" *ngIf="!authService.isLoggedIn()">
                  <label class="form-label small fw-bold text-secondary">Full Name</label>
                  <input type="text" class="form-control" formControlName="guestName" placeholder="Your Name">
                </div>
                <div class="col-md-6" *ngIf="!authService.isLoggedIn()">
                  <label class="form-label small fw-bold text-secondary">Email Address</label>
                  <input type="email" class="form-control" formControlName="guestEmail" placeholder="your@email.com">
                </div>
                <div class="col-12" *ngIf="authService.isLoggedIn()">
                  <div class="alert alert-secondary d-flex align-items-center mb-0 border-0">
                    <span class="material-symbols-outlined me-2 text-primary">person_check</span>
                    <span>Logged in — your contact information is secured.</span>
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary mt-3">Delivery Address</label>
                  <textarea class="form-control" formControlName="shippingAddress" rows="3" placeholder="Full street address, city, region"></textarea>
                </div>
              </div>
            </form>
          </div>

          <!-- Step 2: Payment Method -->
          <div class="merchant-card p-4 p-xl-5">
            <h3 class="h5 fw-bold mb-4 font-headline d-flex align-items-center gap-2">
              <span class="material-symbols-outlined text-primary">payments</span>
              2. Payment Method
            </h3>
            
            <div class="row g-3">
              <div class="col-md-6" *ngFor="let pm of paymentMethods">
                <div class="payment-card border p-3 rounded-3 cursor-pointer d-flex align-items-center gap-3 transition-colors"
                     [ngClass]="{'border-primary bg-primary text-white': selectedPayment === pm.value}"
                     (click)="selectPayment(pm.value)">
                  <span class="material-symbols-outlined">{{pm.icon}}</span>
                  <span class="fw-medium">{{pm.label}}</span>
                </div>
              </div>
            </div>

            <!-- Virtual Fields for Simulation -->
            <div class="mt-4 p-4 bg-light rounded-3" *ngIf="selectedPayment === 'CreditCard'">
              <h5 class="h6 mb-3 fw-bold">Card Details (Simulation)</h5>
              <div class="row g-3 opacity-75">
                <div class="col-12"><input type="text" class="form-control" placeholder="0000 0000 0000 0000"></div>
                <div class="col-6"><input type="text" class="form-control" placeholder="MM/YY"></div>
                <div class="col-6"><input type="text" class="form-control" placeholder="CVV"></div>
              </div>
            </div>
            <div class="mt-4 p-4 bg-light rounded-3" *ngIf="selectedPayment === 'PayPal'">
              <span class="small fw-bold">You will be redirected to PayPal upon submission.</span>
            </div>
          </div>
        </div>

        <!-- Summary & Submission -->
        <div class="col-lg-5">
          <div class="sticky-top" style="top: 100px;">
            <div class="merchant-card p-4 p-xl-5 bg-surface-container-low border border-light shadow-sm">
              <h3 class="h5 fw-bold mb-4 font-headline">Order Summary</h3>
              
              <div class="space-y-3 mb-4">
                <div class="d-flex justify-content-between align-items-center" *ngFor="let item of cartItems">
                  <div class="d-flex align-items-center gap-3">
                    <img [src]="item.productImage" class="rounded object-fit-cover" style="width: 50px; height: 50px;" [alt]="item.productName">
                    <div>
                      <p class="mb-0 fw-medium text-sm">{{ item.productName }}</p>
                      <p class="mb-0 text-secondary x-small">Qty: {{ item.quantity }}</p>
                    </div>
                  </div>
                  <span class="fw-bold">{{ item.subtotal | currency }}</span>
                </div>
              </div>

              <div class="pt-3 border-top border-secondary border-opacity-25 space-y-2 mb-4">
                <div class="d-flex justify-content-between small text-secondary">
                  <span>Subtotal</span>
                  <span>{{ subtotal | currency }}</span>
                </div>
                <div class="d-flex justify-content-between small text-secondary">
                  <span>Shipping</span>
                  <span>{{ shippingCost | currency }}</span>
                </div>
                <div class="d-flex justify-content-between h5 fw-bold pt-2 mt-2 border-top border-secondary border-opacity-25">
                  <span>Total</span>
                  <span class="text-primary">{{ (subtotal > 0 ? subtotal + shippingCost : 0) | currency }}</span>
                </div>
              </div>

              <div *ngIf="errorMsg" class="alert alert-danger small mb-3">{{ errorMsg }}</div>

              <button class="btn btn-primary-merchant w-100 py-3 fw-bold" 
                      [disabled]="isProcessing || cartItems.length === 0 || !shippingForm.valid" 
                      (click)="submitOrder()">
                <ng-container *ngIf="!isProcessing">Place Order - {{ (subtotal + shippingCost) | currency }}</ng-container>
                <ng-container *ngIf="isProcessing">Processing...</ng-container>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Screen -->
      <div class="text-center py-5 merchant-card border-0 shadow-lg py-5 px-3 max-w-lg mx-auto" *ngIf="orderComplete">
        <span class="material-symbols-outlined text-success mb-3" style="font-size: 5rem;">check_circle</span>
        <h2 class="fw-bold mb-3">Order Confirmed</h2>
        <p class="text-secondary mb-4">Your order #{{ completedOrderId }} has been placed successfully.</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-primary-merchant" routerLink="/">Continue Shopping</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .max-w-7xl { max-width: 1400px; margin: 0 auto; min-height: 80vh; }
    .max-w-lg { max-width: 600px; }
    .x-small { font-size: 0.7rem; }
    .text-sm { font-size: 0.9rem; }
    .transition-colors { transition: var(--transition-smooth); }
    .cursor-pointer { cursor: pointer; }
    .payment-card:hover:not(.bg-primary) { background-color: var(--surface-container-low); }
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItemResponse[] = [];
  subtotal: number = 0;
  shippingCost = 150;
  
  shippingForm: FormGroup;
  selectedPayment: string = 'CashOnDelivery';
  isProcessing = false;
  errorMsg = '';
  
  orderComplete = false;
  completedOrderId?: number;

  paymentMethods = [
    { value: 'CreditCard', label: 'Credit Card', icon: 'credit_card' },
    { value: 'PayPal', label: 'PayPal', icon: 'account_balance_wallet' },
    { value: 'CashOnDelivery', label: 'Cash on Delivery', icon: 'local_shipping' },
    { value: 'Wallet', label: 'Vodafone Cash / Wallet', icon: 'smartphone' }
  ];

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      shippingAddress: ['', Validators.required],
      guestName: [''],
      guestEmail: ['']
    });

    if (!this.authService.isLoggedIn()) {
      this.shippingForm.get('guestName')?.setValidators(Validators.required);
      this.shippingForm.get('guestEmail')?.setValidators([Validators.required, Validators.email]);
    }
  }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.subtotal = this.cartService.getCartTotal();
      if (this.cartItems.length === 0 && !this.orderComplete) {
        this.router.navigate(['/cart']);
      }
    });
  }

  selectPayment(method: string) {
    this.selectedPayment = method;
  }

  submitOrder() {
    if (this.shippingForm.invalid) {
      this.errorMsg = 'Please complete all required shipping fields properly.';
      return;
    }
    
    this.errorMsg = '';
    this.isProcessing = true;

    const request: CheckoutRequest = {
      shippingAddress: this.shippingForm.value.shippingAddress,
      paymentMethod: this.selectedPayment as any,
    };

    if (!this.authService.isLoggedIn()) {
      request.guestName = this.shippingForm.value.guestName;
      request.guestEmail = this.shippingForm.value.guestEmail;
    }

    this.orderService.checkout(request).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.orderComplete = true;
        this.completedOrderId = res.id;
        // The API already cleared the server cart, but if guest, we manually clear local
        if (!this.authService.isLoggedIn()) {
          this.cartService.clearCart();
        } else {
          // just reload to get empty state from server
          this.cartService.loadCart();
        }
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMsg = err.error?.message || 'An error occurred during checkout.';
        if (err.error?.errors) {
          this.errorMsg += ' ' + err.error.errors.join(', ');
        }
      }
    });
  }
}

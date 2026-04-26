import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { OrderService } from '../../../services/order.service';
import { CheckoutRequest, CartItemResponse } from '../../../models/interfaces';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout-payment.html',
  styleUrl: './checkout-payment.css'
})
export class CheckoutPaymentComponent implements OnInit {
  cartItems: CartItemResponse[] = [];
  subtotal: number = 0;
  shippingCost = 0;
  
  shippingForm: FormGroup;
  selectedPayment: string = 'CashOnDelivery';
  isProcessing = false;
  errorMsg = '';
  submitted = false;

  paymentMethods = [
    { value: 'CreditCard', label: 'Credit Card', icon: 'credit_card', desc: 'Secure payment via Stripe. Supports Visa, MasterCard, and Amex.' },
    { value: 'CashOnDelivery', label: 'Cash on Delivery', icon: 'local_shipping', desc: 'Pay when your order arrives at your doorstep.' }
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
      this.shippingCost = this.subtotal > 50 ? 0 : 9.99;
      if (this.cartItems.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  selectPayment(method: string) {
    this.selectedPayment = method;
  }

  submitOrder() {
    this.submitted = true;
    this.shippingForm.markAllAsTouched();

    if (this.shippingForm.invalid) {
      this.errorMsg = 'Please complete all required shipping fields.';
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
        
        if (this.selectedPayment === 'CreditCard') {
          // Redirect to credit card step with order ID and amount
          this.router.navigate(['/checkout/payment-card'], { 
            queryParams: { 
              orderId: res.id, 
              amount: res.total 
            } 
          });
        } else {
          // Cash on Delivery - Immediate redirection to confirmation
          this.clearCartAfterSuccess();
          this.router.navigate(['/checkout/order-confirmation'], { 
            queryParams: { orderId: res.id } 
          });
        }
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMsg = err.error?.message || 'An error occurred during checkout. Please try again.';
      }
    });
  }

  private clearCartAfterSuccess() {
    this.cartService.loadCart();
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.shippingForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }
}

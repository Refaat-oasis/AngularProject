import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { CartService } from '../../../services/cart.service';
import { PaymentRequest } from '../../../models/interfaces';
import { environment } from '../../../environment';

declare var Stripe: any;

@Component({
  selector: 'app-payment-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.css'
})
export class PaymentCardComponent implements OnInit, AfterViewInit, OnDestroy {
  stripe: any;
  elements: any;
  card: any;
  
  orderId: string = '';
  amount: number = 0;
  cardholderName: string = '';
  
  isProcessing = false;
  errorMsg = '';
  cardholderTouched = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      this.amount = +params['amount'];
      
      if (!this.orderId || !this.amount) {
        this.router.navigate(['/cart']);
      }
    });

    // Initialize Stripe with the correct Public Key
    this.stripe = Stripe(environment.stripePublishableKey);
    this.elements = this.stripe.elements();
  }

  ngAfterViewInit() {
    // Custom styling for Stripe Elements (Modern/Premium look)
    const style = {
      base: {
        color: 'var(--on-surface)',
        fontFamily: 'Inter, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        background: 'transparent',
        '::placeholder': {
          color: 'var(--on-surface-variant)'
        }
      },
      invalid: {
        color: '#BA1A1A',
        iconColor: '#BA1A1A'
      }
    };

    this.card = this.elements.create('card', { 
      style: style, 
      hidePostalCode: true,
    });
    this.card.mount('#card-element');

    this.card.on('change', (event: any) => {
      if (event.error) {
        this.errorMsg = event.error.message;
      } else {
        this.errorMsg = '';
      }
    });
  }

  handlePayment() {
    this.cardholderTouched = true;
    if (!this.cardholderName) {
      this.errorMsg = 'Please enter the cardholder name.';
      return;
    }

    this.isProcessing = true;
    this.errorMsg = '';

    // Step 1: Create a token via Stripe.js using the card element
    this.stripe.createToken(this.card, { name: this.cardholderName }).then((result: any) => {
      if (result.error) {
        this.errorMsg = result.error.message;
        this.isProcessing = false;
      } else {
        // Step 2: Send the token to the backend
        this.processWithBackend(result.token);
      }
    });
  }

  private processWithBackend(token: any) {
    const payload: PaymentRequest = {
      paymentMethod: 'CreditCard',
      name: this.cardholderName,
      stripeToken: token.id,
      amount: this.amount,
      currency: 'usd',
      orderId: this.orderId.toString()
    };

    this.paymentService.processPayment(payload).subscribe({
      next: (res) => {
        this.isProcessing = false;
        if (res.success) {
          // Payment success - Clear cart and redirect
          this.cartService.clearCart(); 
          this.router.navigate(['/checkout/order-confirmation'], { 
            queryParams: { orderId: this.orderId } 
          });
        } else {
          this.errorMsg = res.message || 'Payment processing failed.';
        }
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMsg = err.error?.message || 'Payment processing failed. Please try again.';
      }
    });
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.destroy();
    }
  }

  get showCardholderError(): boolean {
    return this.cardholderTouched && !this.cardholderName.trim();
  }
}

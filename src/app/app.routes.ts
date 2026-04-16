import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutPaymentComponent } from './pages/checkout/checkout-payment/checkout-payment.component';
import { PaymentCardComponent } from './pages/checkout/payment-card/payment-card.component';
import { OrderConfirmationComponent } from './pages/checkout/order-confirmation/order-confirmation.component';
import { AuthGuard } from './services/auth.guard';
import { Products } from './pages/products/products';
import { ProductDetails } from './pages/product-details/product-details';
import { Reviews } from './pages/reviews/reviews';
import { Rating } from './pages/rating/rating';
import { ProductForm } from './pages/Seller/product-form/product-form';
import { ProductsList } from './pages/Seller/products-list/products-list';
import { SellerLayoutComponent } from './pages/Seller/seller-layout-component/seller-layout-component';
import { ForgotPasswordComponent } from './pages/auth/Forgot password components/forgot-password/forgot-password';
import { ResetPasswordComponent } from './pages/auth/Forgot password components/reset-password/reset-password';
import { UserLayout } from './pages/user-layout/user-layout';

export const routes: Routes = [
{
  path: '',
  component: UserLayout,
  children: [
    { path: '', component: HomeComponent },
    { path: 'products', component: Products },
    { path: 'product/:id', component: ProductDetails,
      children: [
        { path: 'reviews', component: Reviews },
        { path: 'rating', component: Rating }
      ]
    },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutPaymentComponent },
    { path: 'checkout/payment-card', component: PaymentCardComponent },
    { path: 'checkout/order-confirmation', component: OrderConfirmationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
  ]
}
,
  {
    path: 'seller',
    component: SellerLayoutComponent,
     canActivate: [AuthGuard],
  data: { role: 'Seller' },
    children: [
      { path: 'products', component: ProductsList },
      { path: 'products/create', component: ProductForm },
      { path: 'products/edit/:id', component: ProductForm },
    ]
  },

  { path: '**', redirectTo: '' }
];


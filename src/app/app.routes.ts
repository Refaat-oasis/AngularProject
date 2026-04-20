import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/user-layout/user-layout').then(m => m.UserLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'products', loadComponent: () => import('./pages/products/products').then(m => m.ProductsComponent) },
      {
        path: 'product/:id',
        loadComponent: () => import('./pages/product-details/product-details').then(m => m.ProductDetailsComponent),
        children: [
          { path: 'reviews', loadComponent: () => import('./pages/reviews/reviews').then(m => m.ReviewsComponent) },
          { path: 'rating', loadComponent: () => import('./pages/rating/rating').then(m => m.RatingComponent) }
        ]
      },
      { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
      { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout-payment/checkout-payment.component').then(m => m.CheckoutPaymentComponent) },
      { path: 'checkout/payment-card', loadComponent: () => import('./pages/checkout/payment-card/payment-card.component').then(m => m.PaymentCardComponent) },
      { path: 'checkout/order-confirmation', loadComponent: () => import('./pages/checkout/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent) },
      { path: 'orders', loadComponent: () => import('./pages/my-orders/my-orders.component').then(m => m.MyOrdersComponent), canActivate: [AuthGuard] },
      { path: 'login', loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent) },
      { path: 'forgot-password', loadComponent: () => import('./pages/auth/Forgot password components/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
      { path: 'reset-password', loadComponent: () => import('./pages/auth/Forgot password components/reset-password/reset-password').then(m => m.ResetPasswordComponent) },
    ]
  }
  ,
  {
    path: 'seller',
    loadComponent: () => import('./pages/Seller/seller-layout-component/seller-layout-component').then(m => m.SellerLayoutComponent),
    canActivate: [AuthGuard],
    data: { role: 'Seller' },
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', loadComponent: () => import('./pages/Seller/products-list/products-list').then(m => m.ProductsListComponent) },
      { path: 'products/create', loadComponent: () => import('./pages/Seller/product-form/product-form').then(m => m.ProductFormComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('./pages/Seller/product-form/product-form').then(m => m.ProductFormComponent) },
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [AuthGuard],
    data: { role: 'Admin' },
    children: [
      { path: 'users', loadComponent: () => import('./pages/admin/user-management/user-management.component').then(m => m.UserManagementComponent) },
      { path: 'products', loadComponent: () => import('./pages/admin/products-management/products-management.component').then(m => m.ProductsManagementComponent) },
      { path: 'products/create', loadComponent: () => import('./pages/admin/admin-product-form/admin-product-form.component').then(m => m.AdminProductFormComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('./pages/admin/admin-product-form/admin-product-form.component').then(m => m.AdminProductFormComponent) },
      { path: 'categories', loadComponent: () => import('./pages/admin/categories-management/categories-management.component').then(m => m.CategoriesManagementComponent) },
      { path: 'orders', loadComponent: () => import('./pages/admin/orders-management/orders-management.component').then(m => m.OrdersManagementComponent) },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];


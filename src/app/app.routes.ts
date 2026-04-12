import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductListingComponent } from './pages/product-listing/product-listing.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { CartComponent } from './pages/cart/cart.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListingComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Dashboard routes (Placeholder components need to be built or reused)
  // { path: 'seller', component: SellerDashboardComponent, canActivate: [AuthGuard], data: { role: 'Seller' } },
  // { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },
  
  { path: '**', redirectTo: '' }
];


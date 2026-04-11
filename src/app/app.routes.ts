import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './modules/auth/login.component';
import { RegisterComponent } from './modules/auth/register.component';
import { AuthGuard } from './services/auth.guard';
import { SellerDashboardComponent } from './modules/seller/seller-dashboard.component';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Protected Routes
  { 
    path: 'seller', 
    component: SellerDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'Seller' } 
  },
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'Admin' } 
  },
  
  // Wildcard route
  { path: '**', redirectTo: '' }
];

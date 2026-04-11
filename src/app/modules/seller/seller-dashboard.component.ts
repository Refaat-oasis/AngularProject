import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  template: `
    <div class="container my-5">
      <h2 class="fw-bold">Seller Dashboard</h2>
      <p class="text-muted">Welcome, Vendor! Manage your products and orders here.</p>
      <div class="row g-4 mt-2">
        <div class="col-md-4">
          <div class="card text-center p-4 border-primary">
            <h3 class="h1">12</h3>
            <p class="mb-0">Active Products</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center p-4 border-success">
            <h3 class="h1">$2,400</h3>
            <p class="mb-0">Monthly Sales</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center p-4 border-warning">
            <h3 class="h1">5</h3>
            <p class="mb-0">Pending Orders</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SellerDashboardComponent {}

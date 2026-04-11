import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="container my-5">
      <div class="alert alert-danger d-inline-block px-4">Admin Only Access</div>
      <h2 class="fw-bold">Platform Administration</h2>
      <div class="table-responsive mt-4">
        <table class="table table-hover border">
          <thead class="table-light">
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Seller</td>
              <td><span class="badge bg-success">Active</span></td>
              <td><button class="btn btn-sm btn-outline-danger">Block</button></td>
            </tr>
            <tr>
              <td>Alice Smith</td>
              <td>Customer</td>
              <td><span class="badge bg-success">Active</span></td>
              <td><button class="btn btn-sm btn-outline-danger">Block</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {}

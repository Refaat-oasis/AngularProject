import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="w-full border-top border-light mt-5 bg-white py-5">
      <div class="container">
        <div class="row g-5 pb-5">
          <div class="col-lg-4 col-md-12">
            <div class="brand-logo text-2xl font-bold tracking-tighter mb-4">Architectural Merchant</div>
            <p class="text-secondary small max-w-xs">
              Connecting visionary designers with the artisans who build the world's most beautiful spaces.
            </p>
          </div>
          <div class="col-lg-2 col-md-4 col-6">
            <h6 class="font-bold uppercase tracking-wider text-xs mb-4">Navigation</h6>
            <ul class="list-unstyled space-y-2 small">
              <li><a href="#" class="text-secondary text-decoration-none hover-primary">About Us</a></li>
              <li><a href="#" class="text-secondary text-decoration-none hover-primary">Sustainability</a></li>
              <li><a href="#" class="text-secondary text-decoration-none hover-primary">Vendor Applications</a></li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-4 col-6">
            <h6 class="font-bold uppercase tracking-wider text-xs mb-4">Support</h6>
            <ul class="list-unstyled space-y-2 small">
              <li><a href="#" class="text-secondary text-decoration-none hover-primary">Shipping Policy</a></li>
              <li><a href="#" class="text-secondary text-decoration-none hover-primary">Terms of Service</a></li>
              <li><a href="#" class="text-secondary text-decoration-none hover-primary">Privacy</a></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-4">
            <h6 class="font-bold uppercase tracking-wider text-xs mb-4">Newsletter</h6>
            <p class="text-secondary small mb-3">Join the Merchant Guild for exclusive updates.</p>
            <div class="d-flex gap-2">
              <input type="email" class="form-control bg-light border-0 py-2 text-sm" placeholder="Email address">
              <button class="btn btn-primary-merchant px-4 py-2">Join</button>
            </div>
          </div>
        </div>
        <div class="border-top pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p class="text-secondary small mb-0">© 2026 The Architectural Merchant. All rights reserved.</p>
          <div class="d-flex gap-4 small">
            <a href="#" class="text-secondary text-decoration-none hover-primary">Instagram</a>
            <a href="#" class="text-secondary text-decoration-none hover-primary">Pinterest</a>
            <a href="#" class="text-secondary text-decoration-none hover-primary">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .brand-logo { color: var(--primary); }
    .hover-primary:hover { color: var(--primary) !important; }
    .space-y-2 > li { margin-bottom: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
  `]
})
export class FooterComponent {}

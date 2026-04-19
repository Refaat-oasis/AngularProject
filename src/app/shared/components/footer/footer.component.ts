@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="w-full border-top border-theme mt-5 bg-theme-surface py-5 transition-all">
      <div class="container">
        <div class="row g-5 pb-5">
          <div class="col-lg-4 col-md-12">
            <div class="brand-logo text-2xl font-bold tracking-tighter mb-4">Architectural Merchant</div>
            <p class="text-theme-variant small max-w-xs">
              Connecting visionary designers with the artisans who build the world's most beautiful spaces.
            </p>
            <div class="mt-4 d-flex gap-3">
               <button class="btn btn-link p-0 text-theme-variant border-0 social-hover"><span class="material-symbols-outlined">description</span></button>
               <button class="btn btn-link p-0 text-theme-variant border-0 social-hover"><span class="material-symbols-outlined">public</span></button>
               <button class="btn btn-link p-0 text-theme-variant border-0 social-hover"><span class="material-symbols-outlined">mail</span></button>
            </div>
          </div>
          <div class="col-lg-2 col-md-4 col-6">
            <h6 class="font-bold uppercase tracking-wider text-xs mb-4 text-theme-primary">Navigation</h6>
            <ul class="list-unstyled space-y-2 small">
              <li><button (click)="navigateTo('/')" class="btn btn-link p-0 text-theme-variant text-decoration-none hover-secondary border-0">Shop All</button></li>
              <li><button (click)="navigateTo('/')" class="btn btn-link p-0 text-theme-variant text-decoration-none hover-secondary border-0">New Arrivals</button></li>
              <li><button (click)="navigateTo('/')" class="btn btn-link p-0 text-theme-variant text-decoration-none hover-secondary border-0">Categories</button></li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-4 col-6">
            <h6 class="font-bold uppercase tracking-wider text-xs mb-4 text-theme-primary">Support</h6>
            <ul class="list-unstyled space-y-2 small">
              <li><button (click)="navigateTo('/')" class="btn btn-link p-0 text-theme-variant text-decoration-none hover-secondary border-0">Shipping Policy</button></li>
              <li><button (click)="navigateTo('/')" class="btn btn-link p-0 text-theme-variant text-decoration-none hover-secondary border-0">Terms & Privacy</button></li>
              <li><button (click)="navigateTo('/')" class="btn btn-link p-0 text-theme-variant text-decoration-none hover-secondary border-0">Contact Us</button></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-4">
            <h6 class="font-bold uppercase tracking-wider text-xs mb-4 text-theme-primary">Join the Guild</h6>
            <p class="text-theme-variant small mb-3">Subscribe for exclusive collection drops and artisan stories.</p>
            <div class="d-flex gap-2">
              <input type="email" class="form-control bg-surface-variant border-0 py-2.5 text-sm text-theme px-3 rounded-3" placeholder="your@email.com">
              <button class="btn btn-primary-merchant px-4 py-2 rounded-3">Join</button>
            </div>
          </div>
        </div>
        <div class="border-top border-theme pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p class="text-theme-variant small mb-0 opacity-75">© 2026 Architectural Merchant. Crafted for Quality.</p>
          <div class="d-flex gap-4 small">
            <button class="btn btn-link p-0 text-theme-variant text-decoration-none hover-secondary border-0">Sustainability</button>
            <button class="btn btn-link p-0 text-theme-variant text-decoration-none hover-secondary border-0">Artisans</button>
            <button class="btn btn-link p-0 text-theme-variant text-decoration-none hover-secondary border-0">Press</button>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .brand-logo { color: var(--on-surface); font-family: var(--font-headline); }
    .text-theme-primary { color: var(--on-surface); }
    .text-theme-variant { color: var(--on-surface-variant); }
    .border-theme { border-color: var(--outline-variant) !important; }
    .hover-secondary:hover { color: var(--secondary) !important; }
    .space-y-2 > li { margin-bottom: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .bg-surface-variant { background-color: var(--surface-container-low); }
    .text-theme { color: var(--on-surface); }
    .btn-link { font-size: inherit; font-weight: inherit; transition: var(--transition-smooth); }
    .social-hover:hover { color: var(--primary); transform: translateY(-2px); }
  `]
})
export class FooterComponent {
  private router = inject(Router);

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="not-found-container d-flex align-items-center justify-content-center">
      <div class="text-center px-4 not-found-card">
        <span class="material-symbols-outlined mb-4 not-found-icon" style="font-size: 6rem; color: var(--outline-variant);">
          explore_off
        </span>
        <h1 class="font-editorial mb-3" style="font-size: clamp(4rem, 10vw, 8rem); color: var(--primary);">404</h1>
        <h2 class="h4 fw-bold mb-3 text-theme-primary">Page Not Found</h2>
        <p class="text-theme-variant mb-5 mx-auto" style="max-width: 400px;">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div class="d-flex flex-wrap justify-content-center gap-3">
          <a routerLink="/" class="btn btn-primary-merchant px-5 py-3">Back to Home</a>
          <a routerLink="/products" class="btn btn-outline-secondary px-5 py-3 rounded-pill fw-bold">Browse Products</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 80vh;
      padding: 2rem 1rem;
      background:
        radial-gradient(circle at top, rgba(0, 99, 151, 0.08), transparent 30%),
        var(--background);
    }
    .not-found-card {
      max-width: 620px;
      padding: 3rem 2rem;
      border-radius: 32px;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: var(--shadow-elevated);
      backdrop-filter: blur(12px);
    }
    .not-found-icon {
      display: inline-flex;
      width: 110px;
      height: 110px;
      border-radius: 999px;
      align-items: center;
      justify-content: center;
      background: var(--surface-container-low);
      box-shadow: var(--shadow-ambient);
    }
  `]
})
export class NotFoundComponent {}

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { IProduct } from '../../../../models/iproduct';
// import { ProductService } from '../../../../services/product-service';

// @Component({
//   selector: 'app-trending-products',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './trending-products.component.html',
//   styleUrl: './trending-products.component.css'
// })
// export class TrendingProductsComponent implements OnInit {

//   products: IProduct[] = [];
//   baseUrl: string = 'http://localhost:5118';

//   constructor(private dataService: ProductService) { }

//   ngOnInit(): void {
//     this.dataService.getAll().subscribe((res: IProduct[]) => {

//       this.products = res.slice(0, 4).map(p => ({
//         ...p,
//         image: this.baseUrl + p.image
//       }));

//       console.log(this.products);
//       console.log("products loaded successfully");
//     });
//   }
// }

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { IProduct } from '../../../../models/iproduct';
import { ProductService } from '../../../../services/product-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trending-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './trending-products.component.html',
  styleUrl: './trending-products.component.css'
})
export class TrendingProductsComponent implements OnInit {

  products = signal<IProduct[]>([]);

  readonly imageBaseUrl = 'http://localhost:5118';

  readonly fallbackImage =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720">' +
      '<rect width="600" height="720" fill="#f7fafc"/>' +
      '<circle cx="220" cy="240" r="54" fill="#cbd5e0"/>' +
      '<path d="M100 560l120-118 92 76 92-112 96 154H100z" fill="#a0aec0"/>' +
      '<text x="300" y="650" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#4a5568">No Image</text>' +
      '</svg>'
    );

  constructor(private dataService: ProductService) {}

  ngOnInit(): void {
    this.dataService.getAll().subscribe({
      next: (res: IProduct[]) => {
        this.products.set(res.slice(0, 4));
      },
      error: (err) => {
        console.error('Failed to load trending products', err);
      }
    });
  }

  getImageUrl(path: string | null | undefined): string {
    if (!path) return this.fallbackImage;

    if (path.startsWith('data:image') || path.startsWith('http')) {
      return path;
    }

    return path.startsWith('/')
      ? `${this.imageBaseUrl}${path}`
      : `${this.imageBaseUrl}/${path}`;
  }

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.src !== this.fallbackImage) {
      image.src = this.fallbackImage;
    }
  }
}


import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product-service';
import { IProduct } from '../../models/iproduct';
import { Rating } from '../rating/rating';
import { Reviews } from '../reviews/reviews';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, RouterLink , Rating , Reviews],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  product = signal<IProduct | null>(null);
  loading = signal(true);
  error = signal('');
  selectedImage = signal('');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.selectedImage.set('http://localhost:5118' + data.image);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Product not found.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }
}

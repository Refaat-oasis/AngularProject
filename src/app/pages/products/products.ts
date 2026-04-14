import { Component, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IProduct } from '../../models/iproduct';
import { ProductService } from '../../services/product-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe , RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  products = signal<IProduct[]>([]);
  loading = signal(true);
  error = signal('');
  categories = signal(['Lighting', 'Hardware', 'Surfaces', 'Furniture', 'Decor']);


  hasProducts = computed(() => this.products().length > 0);
  isReady = computed(() => !this.loading() && !this.error());

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load products.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }
}

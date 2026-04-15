import { Component, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IProduct } from '../../models/iproduct';
import { ProductService } from '../../services/product-service';
import { RouterLink } from '@angular/router';
import { Icategory } from '../../models/icategory';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
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
categories = signal<Icategory[]>([]);


  hasProducts = computed(() => this.products().length > 0);
  isReady = computed(() => !this.loading() && !this.error());

 constructor(
  private productService: ProductService,
  private categoryService: CategoryService,
  private route: ActivatedRoute
) {}

ngOnInit(): void {


  this.categoryService.getAll().subscribe({
    next: (data) => this.categories.set(data),
    error: (err) => console.error(err)
  });


  this.route.queryParams.pipe(
    switchMap(params => {
      const search = params['search'];

      this.loading.set(true);

      if (search && search.trim() !== '') {
        return this.productService.search(search);
      }

      return this.productService.getAll();
    })
  ).subscribe({
    next: (data) => {
      this.products.set(data);
      this.loading.set(false);
    },
    error: (err) => {
      this.error.set('Failed to load products.');
      this.loading.set(false);
    }
  });

}


loadCategoryProducts(categoryId: number) {
  this.loading.set(true);
  this.error.set('');

  this.categoryService.getByCategory(categoryId).subscribe({
    next: (data) => {
      this.products.set(data.products); 
      this.loading.set(false);
    },
    error: () => {
      this.error.set('Failed to load category products');
      this.loading.set(false);
    }
  });
}
}

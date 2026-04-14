import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IProduct } from '../../../models/iproduct';
import { ProductService } from '../../../services/product-service';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {

  products = signal<IProduct[]>([]);
  baseUrl = 'http://localhost:5118';
selectedId!: number;
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe(res => {
      this.products.set(res);
    });
  }

  delete(id: number) {
      const confirmDelete = confirm('Are you sure you want to delete this product?');

  if (!confirmDelete) return;
    this.productService.delete(id).subscribe(() => {
      this.loadProducts();
    });
  }



openConfirm(id: number) {
  this.selectedId = id;
}

confirmDelete() {
  this.productService.delete(this.selectedId).subscribe(() => {
    this.loadProducts();
  });
}
}

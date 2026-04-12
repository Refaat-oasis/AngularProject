import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Product } from '../../../../services/mock-data.service';

@Component({
  selector: 'app-trending-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trending-products.component.html',
  styleUrl: './trending-products.component.css'
})
export class TrendingProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getTrendingProducts().subscribe((prods: Product[]) => this.products = prods);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../../../models/iproduct';
import { ProductService } from '../../../../services/product-service';

@Component({
  selector: 'app-trending-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trending-products.component.html',
  styleUrl: './trending-products.component.css'
})
export class TrendingProductsComponent implements OnInit {

  products: IProduct[] = [];
  baseUrl: string = 'https://localhost:5118';

  constructor(private dataService: ProductService) { }

  ngOnInit(): void {
    this.dataService.getAll().subscribe((res: IProduct[]) => {

      this.products = res.slice(0, 4).map(p => ({
        ...p,
        image: this.baseUrl + p.image
      }));

      console.log(this.products);
      console.log("products loaded successfully");
    });
  }
}


// import { Component, OnInit, signal } from '@angular/core';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { CurrencyPipe } from '@angular/common';
// import { ProductService } from '../../services/product-service';
// import { IProduct } from '../../models/iproduct';
// import { Rating } from '../rating/rating';
// import { Reviews } from '../reviews/reviews';

// @Component({
//   selector: 'app-product-details',
//   imports: [CurrencyPipe, RouterLink , Rating , Reviews],
//   templateUrl: './product-details.html',
//   styleUrl: './product-details.css',
// })
// export class ProductDetails implements OnInit {
//   product = signal<IProduct | null>(null);
//   loading = signal(true);
//   error = signal('');
//   selectedImage = signal('');

//   constructor(
//     private route: ActivatedRoute,
//     private productService: ProductService
//   ) {}

//   ngOnInit(): void {
//     const id = Number(this.route.snapshot.paramMap.get('id'));
//     this.productService.getById(id).subscribe({
//       next: (data) => {
//         this.product.set(data);
//         this.selectedImage.set('http://localhost:5118' + data.image);
//         this.loading.set(false);
//       },
//       error: (err) => {
//         this.error.set('Product not found.');
//         this.loading.set(false);
//         console.error(err);
//       }
//     });
//   }
// }

import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product-service';
import { IProduct } from '../../models/iproduct';
import { Rating } from '../rating/rating';
import { Reviews } from '../reviews/reviews';
import { ReviewService } from '../../services/review-services';
import { AuthService } from '../../services/auth.service';
import { CreateReviewDto } from '../../services/review-services'; 
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, RouterLink , Rating , Reviews, FormsModule,DecimalPipe ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {

roundedAvgRating = computed(() => Math.floor(this.avgRating()));
  reviewComment = '';
reviewRating = 5;
  reviewSubmitting = signal(false);
  reviewSuccess = signal(false);
  reviewError = signal('');
  reviews = signal<any[]>([]);


  product = signal<IProduct | null>(null);
  loading = signal(true);
  avgRating = signal(0);
  error = signal('');
  selectedImage = signal('');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    public authService: AuthService,
    private cartService: CartService
  ) {}

  addToCart() {
    const prod = this.product();
    if (prod) {
      this.cartService.addToCart(prod.id, 1);
    }
  }


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.reviewService.getProductReviews(id).subscribe({  
      next: (data) => this.reviews.set(data),
      error: (err) => console.error(err)
    }
  
  
  );
    
    
    this.reviewService.getProductAvgRate(id).subscribe({
      next: (data) => this.avgRating.set(data),
  error: (err) => console.error(err)
    });



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
  showReviewForm = signal(false);

toggleReviewForm() {
  this.showReviewForm.update(v => !v);
}
submitReview(): void {
  const dto: CreateReviewDto = {
    productId: Number(this.route.snapshot.paramMap.get('id')),
    comment: this.reviewComment,
    starRating: this.reviewRating
  };
  this.reviewSubmitting.set(true);
    this.reviewService.addReview(dto).subscribe({
      next: () => {
        this.reviewSuccess.set(true);
       
        this.reviewSubmitting.set(false);
        this.reviewService.getProductReviews(dto.productId).subscribe({
          next: (data) => this.reviews.set(data)
        });
      },
      error: () => {
        this.reviewError.set('Failed to submit review.');
        this.reviewSubmitting.set(false);
      }
    });
  }
}
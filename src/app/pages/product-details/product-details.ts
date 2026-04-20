
import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product-service';
import { IProduct } from '../../models/iproduct';
import { Rating } from '../rating/rating';
import { Reviews } from '../reviews/reviews';
import { ReviewService } from '../../services/review-services';
import { AuthService } from '../../services/auth.service';
import { CreateReviewDto } from '../../services/review-services';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { environment } from '../../environment';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, RouterLink, Rating, Reviews, FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {

  product = signal<IProduct | null>(null);
  loading = signal(false);
  avgRating = signal(0);
  reviews = signal<any[]>([]);
  reviewComment = '';
  reviewRating = 5;
  reviewSubmitting = signal(false);
  reviewSuccess = signal(false);
  reviewError = signal('');
  showReviewForm = signal(false);

  roundedAvgRating = computed(() => Math.floor(this.avgRating()));
  selectedImage = signal('');

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
    private reviewService: ReviewService,
    public authService: AuthService,
    private cartService: CartService
  ) {}

  addToCart(): void {
    const prod = this.product();
    if (prod) {
      this.cartService.addToCart(prod.id, 1);
    }
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
    this.loadReviews(id);
    this.loadAvgRating(id);
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.productService.getById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.selectedImage.set(environment.baseUrl + data.image);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  loadReviews(id: number): void {
    this.reviewService.getProductReviews(id).subscribe({
      next: (data) => this.reviews.set(data),
      error: (err) => console.error(err)
    });
  }

  loadAvgRating(id: number): void {
    this.reviewService.getProductAvgRate(id).subscribe({
      next: (data) => this.avgRating.set(data),
      error: (err) => console.error(err)
    });
  }

  toggleReviewForm(): void {
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
        this.loadReviews(dto.productId);
      },
      error: (err) => {
        console.error(err);
        this.reviewSubmitting.set(false);
      }
    });
  }
}
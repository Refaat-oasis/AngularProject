import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { finalize } from 'rxjs';
import { ProductService } from '../../services/product-service';
import { IProduct } from '../../models/iproduct';
import { RatingComponent } from '../rating/rating';
import { ReviewsComponent } from '../reviews/reviews';
import { ReviewService } from '../../services/review-services';
import { AuthService } from '../../services/auth.service';
import { CreateReviewDto } from '../../services/review-services';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { environment } from '../../environment';
import { FavouritesService } from '../../services/favourites.service';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, RatingComponent, ReviewsComponent, FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetailsComponent implements OnInit {
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
  cartFeedback = signal<{ tone: 'success' | 'error'; message: string } | null>(null);
  favouriteFeedback = signal('');
  isAddingToCart = signal(false);

  roundedAvgRating = computed(() => Math.floor(this.avgRating()));
  selectedImage = signal('');
  isFavourite = computed(() => {
    const product = this.product();
    return !!product && this.favouritesService.isFavourite(product.id);
  });

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
    private reviewService: ReviewService,
    public authService: AuthService,
    private cartService: CartService,
    public favouritesService: FavouritesService
  ) {}

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image) {
      return;
    }

    image.src =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720">' +
        '<rect width="600" height="720" fill="#f7fafc"/>' +
        '<circle cx="220" cy="240" r="54" fill="#cbd5e0"/>' +
        '<path d="M100 560l120-118 92 76 92-112 96 154H100z" fill="#a0aec0"/>' +
        '<text x="300" y="650" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#4a5568">No Image</text>' +
        '</svg>'
      );
  }

  addToCart(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    this.isAddingToCart.set(true);
    this.cartFeedback.set(null);

    this.cartService.addToCart(product.id, 1).pipe(
      finalize(() => this.isAddingToCart.set(false))
    ).subscribe({
      next: () => {
        this.cartFeedback.set({
          tone: 'success',
          message: 'Success! Added to your collection.'
        });
      },
      error: (error) => {
        this.cartFeedback.set({
          tone: 'error',
          message: error.error?.message || 'We could not add this product to your cart. Please try again.'
        });
      }
    });
  }

  toggleFavourite(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    const isFavouriteNow = this.favouritesService.toggle(product);
    this.favouriteFeedback.set(isFavouriteNow ? 'Saved to favourites.' : 'Removed from favourites.');
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
    this.loadReviews(id);
    this.loadAvgRating(id);
  }

  getImageUrl(product: IProduct | null | undefined): string {
    const fallbackImage =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720">' +
        '<rect width="600" height="720" fill="#f7fafc"/>' +
        '<circle cx="220" cy="240" r="54" fill="#cbd5e0"/>' +
        '<path d="M100 560l120-118 92 76 92-112 96 154H100z" fill="#a0aec0"/>' +
        '<text x="300" y="650" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#4a5568">No Image</text>' +
        '</svg>'
      );

    if (!product) {
      return fallbackImage;
    }

    const rawPath = product.imageUrl || product.image;
    if (!rawPath) {
      return fallbackImage;
    }
    const path = rawPath.replace(/\\/g, '/').trim();

    if (path.startsWith('data:image') || path.startsWith('http')) {
      return path;
    }

    if (path.startsWith('/images/')) {
      return path;
    }

    if (path.startsWith('images/')) {
      return `/${path}`;
    }

    if (!path.includes('/')) {
      return `/images/products/${path}`;
    }

    return path.startsWith('/') ? `${environment.baseUrl}${path}` : `${environment.baseUrl}/${path}`;
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.productService.getById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.selectedImage.set(this.getImageUrl(data));
        this.cartFeedback.set(null);
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
    this.showReviewForm.update(value => !value);
  }

  submitReview(): void {
    const dto: CreateReviewDto = {
      productId: Number(this.route.snapshot.paramMap.get('id')),
      comment: this.reviewComment,
      starRating: this.reviewRating
    };

    this.reviewSubmitting.set(true);
    this.reviewSuccess.set(false);
    this.reviewError.set('');

    this.reviewService.addReview(dto).subscribe({
      next: () => {
        this.reviewSuccess.set(true);
        this.reviewSubmitting.set(false);
        this.reviewComment = '';
        this.reviewRating = 5;
        this.loadReviews(dto.productId);
      },
      error: (err) => {
        console.error(err);
        this.reviewSubmitting.set(false);
        this.reviewError.set(err.error?.message || 'We could not submit your review. Please try again.');
      }
    });
  }
}

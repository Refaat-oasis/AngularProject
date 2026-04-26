import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../services/category-service';
import { ICategory } from '../../../../models/icategory';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-categories.html',
  styleUrl: './featured-categories.css'
})
export class FeaturedCategoriesComponent implements OnInit {
  categories = signal<ICategory[]>([]);
  loading = signal(false);

  private router = inject(Router);
  private categoryService = inject(CategoryService);

  readonly fallbackImage = 
    'data:image/svg+xml;utf8,' + 
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720">' +
      '<rect width="600" height="720" fill="#f7fafc"/>' +
      '<circle cx="300" cy="360" r="100" fill="#cbd5e0"/>' +
      '<text x="300" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" fill="#4a5568">NEXUS</text>' +
      '</svg>'
    );

  useFallbackImage(event: any) {
    event.target.src = this.fallbackImage;
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: (cats: ICategory[]) => {
        // Take the first 6
        this.categories.set(cats.slice(0, 6));
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  navigateToProducts(categoryId?: number): void {
    const queryParams = categoryId ? { category: categoryId } : undefined;
    this.router.navigate(['/products'], { queryParams });
  }
}

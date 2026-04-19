import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Category } from '../../../../services/mock-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-categories.component.html',
  styleUrl: './featured-categories.component.css'
})
export class FeaturedCategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  loading = signal(false);

  private router = inject(Router);
  private dataService = inject(MockDataService);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.dataService.getCategories().subscribe({
      next: (cats: Category[]) => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}

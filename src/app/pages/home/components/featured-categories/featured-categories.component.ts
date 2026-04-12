import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Category } from '../../../../services/mock-data.service';

@Component({
  selector: 'app-featured-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-categories.component.html',
  styleUrl: './featured-categories.component.css'
})
export class FeaturedCategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getCategories().subscribe((cats: Category[]) => this.categories = cats);
  }
}

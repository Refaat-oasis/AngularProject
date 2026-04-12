import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturedCategoriesComponent } from './components/featured-categories/featured-categories.component';
import { TrendingProductsComponent } from './components/trending-products/trending-products.component';
import { ArtisansComponent } from './components/artisans/artisans.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    FeaturedCategoriesComponent,
    TrendingProductsComponent,
    ArtisansComponent,
    NewsletterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent { }

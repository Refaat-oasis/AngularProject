import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero';
import { FeaturedCategoriesComponent } from './components/featured-categories/featured-categories';
import { TrendingProductsComponent } from './components/trending-products/trending-products';
import { SocialFeedComponent } from './components/social-feed/social-feed';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    FeaturedCategoriesComponent,
    TrendingProductsComponent,
    SocialFeedComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent { }

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  imports: [],
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class RatingComponent {
    @Input() rating: number = 0;

  stars = [1, 2, 3, 4, 5];
}

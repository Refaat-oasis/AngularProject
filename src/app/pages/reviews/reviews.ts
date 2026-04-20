import { Component ,Input} from '@angular/core';

@Component({
  selector: 'app-reviews',
  imports: [],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class ReviewsComponent {
    @Input() reviews: any[] = [];
    
}

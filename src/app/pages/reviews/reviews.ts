import { Component ,Input} from '@angular/core';
import { Rating } from '../rating/rating';

@Component({
  selector: 'app-reviews',
  imports: [Rating],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews {
    @Input() reviews: any[] = [];
    
}

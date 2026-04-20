import { Component ,Input} from '@angular/core';

@Component({
  selector: 'app-reviews',
  imports: [],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews {
    @Input() reviews: any[] = [];
    
}

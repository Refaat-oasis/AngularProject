import { Component } from '@angular/core';
import { FavouritesListComponent } from '../../shared/components/favourites-list/favourites-list';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [FavouritesListComponent],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css'
})
export class FavouritesComponent {}

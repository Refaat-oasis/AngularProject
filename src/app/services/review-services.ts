
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environment';

export interface ReviewDto {
  id: number;
  comment: string;
  userName: string;
  createdAt: string;
}
export interface CreateReviewDto {
  productId: number;
  comment: string;
  starRating: number;
}
@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/Reviews`;


  


  constructor(private http: HttpClient, public authService: AuthService) {}

  getProductReviews(productId: number): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.apiUrl}/product/${productId}`);
  }

getProductAvgRate(productId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/average/${productId}`);
  }

  addReview(dto: CreateReviewDto): Observable<void> {
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`
  });
    return this.http.post<void>(`${this.apiUrl}`, dto, { headers });
  }



}
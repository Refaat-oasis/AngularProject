import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutRequest, OrderResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:5118/api/orders';

  constructor(private http: HttpClient) {}

  checkout(orderData: CheckoutRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.baseUrl}/checkout`, orderData);
  }

  getUserOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.baseUrl);
  }

  getOrderDetails(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${id}`);
  }
}


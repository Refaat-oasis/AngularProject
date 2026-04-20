import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CheckoutRequest, OrderResponse } from '../models/interfaces';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  checkout(orderData: CheckoutRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.baseUrl}/checkout`, orderData);
  }

  getUserOrders(): Observable<OrderResponse[]> {
    return this.http.get<unknown>(this.baseUrl).pipe(
      map(response => this.extractData<OrderResponse>(response))
    );
  }

  getOrderDetails(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${id}`);
  }

  private extractData<T>(response: unknown): T[] {
    if (Array.isArray(response)) {
      return response as T[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const record = response as Record<string, unknown>;
    const candidates = [
      record['result'],
      record['data'],
      record['orders'],
      record['items'],
      record['value'],
      record['$values']
    ];

    for (const candidate of candidates) {
      if (candidate) {
        const extracted = this.extractData<T>(candidate);
        if (extracted.length) {
          return extracted;
        }
      }
    }

    return [];
  }
}

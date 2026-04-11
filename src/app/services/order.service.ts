import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'https://localhost:7001/api/orders';

  constructor(private http: HttpClient) {}

  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, orderData);
  }

  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my-orders`);
  }

  getOrderDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}

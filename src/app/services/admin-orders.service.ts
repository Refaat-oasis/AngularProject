import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { OrderResponse } from '../models/interfaces';
import { environment } from '../environment';

export interface UpdateOrderStatusDto {
  status: string;
}

export interface UpdateOrderStatusResponse {
  message?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
  private readonly baseUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<OrderResponse[]> {
    return this.http.get<unknown>(`${this.baseUrl}/admin/all`).pipe(
      map((response) => this.extractOrders(response))
    );
  }

  getOrderDetails(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/admin/${id}`);
  }

  updateOrderStatus(id: number, body: UpdateOrderStatusDto): Observable<UpdateOrderStatusResponse> {
    return this.http.put<UpdateOrderStatusResponse>(`${this.baseUrl}/admin/${id}/status`, body);
  }

  private extractOrders(response: unknown): OrderResponse[] {
    if (Array.isArray(response)) {
      return response as OrderResponse[];
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
      const extracted = this.extractOrders(candidate);
      if (extracted.length) {
        return extracted;
      }
    }

    return [];
  }
}

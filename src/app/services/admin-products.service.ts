import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AdminProduct, ReactivateProductResponse } from '../models/admin-product.models';

@Injectable({
  providedIn: 'root'
})
export class AdminProductsService {
  private readonly baseUrl = 'http://localhost:5118/api/Products';

  constructor(private http: HttpClient) {}

  getAllForAdmin(): Observable<AdminProduct[]> {
    return this.http.get<unknown>(`${this.baseUrl}/all`).pipe(
      map((response) => this.extractProducts(response))
    );
  }

  getById(id: number): Observable<AdminProduct> {
    return this.http.get<AdminProduct>(`${this.baseUrl}/${id}`);
  }

  create(data: FormData): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(this.baseUrl, data);
  }

  update(id: number, data: FormData): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  reactivate(id: number): Observable<ReactivateProductResponse> {
    return this.http.put<ReactivateProductResponse>(`${this.baseUrl}/${id}/reactivate`, {});
  }

  private extractProducts(response: unknown): AdminProduct[] {
    if (Array.isArray(response)) {
      return response as AdminProduct[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const record = response as Record<string, unknown>;
    const candidates = [
      record['result'],
      record['data'],
      record['products'],
      record['items'],
      record['value'],
      record['$values']
    ];

    for (const candidate of candidates) {
      const extracted = this.extractProducts(candidate);
      if (extracted.length) {
        return extracted;
      }
    }

    return [];
  }
}

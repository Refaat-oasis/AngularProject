import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  AdminCategoryWithProducts
} from '../models/admin-category.models';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class AdminCategoriesService {
  private readonly baseUrl = `${environment.apiUrl}/Categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AdminCategory[]> {
    return this.http.get<unknown>(this.baseUrl).pipe(
      map((response) => this.extractCategories(response))
    );
  }

  getWithProducts(id: number): Observable<AdminCategoryWithProducts> {
    return this.http.get<AdminCategoryWithProducts>(`${this.baseUrl}/${id}/products`);
  }

  create(formData: FormData): Observable<AdminCategory> {
    return this.http.post<AdminCategory>(this.baseUrl, formData);
  }

  update(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  forceDelete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/with-products`);
  }

  private extractCategories(response: unknown): AdminCategory[] {
    if (Array.isArray(response)) {
      return response as AdminCategory[];
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const record = response as Record<string, unknown>;
    const candidates = [
      record['result'],
      record['data'],
      record['categories'],
      record['items'],
      record['value'],
      record['$values']
    ];

    for (const candidate of candidates) {
      const extracted = this.extractCategories(candidate);
      if (extracted.length) {
        return extracted;
      }
    }

    return [];
  }
}

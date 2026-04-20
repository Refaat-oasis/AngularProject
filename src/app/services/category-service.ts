import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from '../models/icategory';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.baseUrl);
  }

  getByCategory(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/products`);
  }
}

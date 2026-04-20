import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Icategory } from '../models/icategory';
import { environment } from '../environment';


@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Icategory[]> {
    return this.http.get<Icategory[]>(this.baseUrl);
  }
  getByCategory(id: number) {
  return this.http.get<any>(`${this.baseUrl}/${id}/products`);
}
}

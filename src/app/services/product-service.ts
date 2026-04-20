import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../models/iproduct';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl);
  }

  getById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
}
search(term: string) {
  return this.http.get<any[]>(
    `${this.apiUrl}/search?term=${term}`
  );
}
getMyProducts() {
  return this.http.get<any[]>(`${this.apiUrl}/my-products`);
}


create(data: FormData) {
  return this.http.post(this.apiUrl, data);
}

update(id: number, data: FormData) {
  return this.http.put(`${this.apiUrl}/${id}`, data);
}

delete(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
}


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, map } from 'rxjs';
// import { IProduct } from '../models/iproduct';
// import { environment } from '../environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductService {
//   private apiUrl = `${environment.apiUrl}/products`;

//   constructor(private http: HttpClient) {}

//   private isDummyProduct(product: IProduct): boolean {
//     const name = (product?.name ?? '').trim();
//     const description = (product?.description ?? '').trim();
//     const image = (product?.imageUrl || product?.image || '').trim().toLowerCase();

//     return /^product\s+\d+$/i.test(name)
//       && /^description for product\s+\d+$/i.test(description)
//       && image.includes('picsum.photos');
//   }

//   private normalizeProducts(products: IProduct[]): IProduct[] {
//     return (products ?? []).filter((product) => !this.isDummyProduct(product));
//   }

//   getAll(): Observable<IProduct[]> {
//     return this.http
//       .get<IProduct[]>(this.apiUrl)
//       .pipe(map((products) => this.normalizeProducts(products)));
//   }

//   getById(id: number): Observable<IProduct> {
//     return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
//   }

//   getByCategory(categoryId: number): Observable<IProduct[]> {
//     return this.http
//       .get<IProduct[]>(`${this.apiUrl}?categoryId=${categoryId}`)
//       .pipe(map((products) => this.normalizeProducts(products)));
//   }

//   search(term: string): Observable<IProduct[]> {
//     return this.http
//       .get<IProduct[]>(`${this.apiUrl}/search?term=${term}`)
//       .pipe(map((products) => this.normalizeProducts(products)));
//   }

//   getMyProducts(): Observable<IProduct[]> {
//     return this.http
//       .get<IProduct[]>(`${this.apiUrl}/my-products`)
//       .pipe(map((products) => this.normalizeProducts(products)));
//   }

//   create(data: FormData): Observable<any> {
//     return this.http.post(this.apiUrl, data);
//   }

//   update(id: number, data: FormData): Observable<any> {
//     return this.http.put(`${this.apiUrl}/${id}`, data);
//   }

//   delete(id: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${id}`);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProduct } from '../models/iproduct';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private categoriesUrl = `${environment.apiUrl}/categories`; // ✅ added

  constructor(private http: HttpClient) {}

  private isDummyProduct(product: IProduct): boolean {
    const name = (product?.name ?? '').trim();
    const description = (product?.description ?? '').trim();
    const image = (product?.imageUrl || product?.image || '').trim().toLowerCase();

    return /^product\s+\d+$/i.test(name)
      && /^description for product\s+\d+$/i.test(description)
      && image.includes('picsum.photos');
  }

  private normalizeProducts(products: IProduct[]): IProduct[] {
    return (products ?? []).filter((product) => !this.isDummyProduct(product));
  }

  getAll(): Observable<IProduct[]> {
    return this.http
      .get<IProduct[]>(this.apiUrl)
      .pipe(map((products) => this.normalizeProducts(products)));
  }

  getById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  getByCategory(categoryId: number): Observable<IProduct[]> {
    return this.http
      .get<any>(`${this.categoriesUrl}/${categoryId}/products`) // ✅ correct URL
      .pipe(map((data) => {
        const products = Array.isArray(data) ? data : data.products ?? [];
        return this.normalizeProducts(products);
      }));
  }

  search(term: string): Observable<IProduct[]> {
    return this.http
      .get<IProduct[]>(`${this.apiUrl}/search?term=${term}`)
      .pipe(map((products) => this.normalizeProducts(products)));
  }

  getMyProducts(): Observable<IProduct[]> {
    return this.http
      .get<IProduct[]>(`${this.apiUrl}/my-products`)
      .pipe(map((products) => this.normalizeProducts(products)));
  }

  create(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
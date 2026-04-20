import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest } from '../models/interfaces';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = `${environment.apiUrl}/Payment`;

  constructor(private http: HttpClient) {}

  processPayment(paymentData: PaymentRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/ProcessPayment`, paymentData);
  }
}
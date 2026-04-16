import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:5118/api/Payment';

  constructor(private http: HttpClient) {}

  processPayment(paymentData: PaymentRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/ProcessPayment`, paymentData);
  }
}
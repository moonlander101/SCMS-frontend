// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  product_id: number;
  count: number;
  unit_price: number;
}

export interface OrderDetails {
  warehouse_id: number;
  nearest_city: string;
  latitude: string;
  longitude: string;
}

export interface OrderResponse {
  order_id: number;
  user_id: number;
  status: string;
  blockchain_tx_id: string;
  ipfs_hash: string;
  created_at: string;
  products: Product[];
  details: OrderDetails;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://127.0.0.1:8000/api/v0/orders/vendor';

  constructor(private http: HttpClient) {}

  getOrdersByVendorId(vendorId: number): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/${vendorId}/`);
  }
}

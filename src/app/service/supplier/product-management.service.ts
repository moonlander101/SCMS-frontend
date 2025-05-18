import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

export interface ApiProductListItem {
  product_name: string;
  SKU: string;
  supplier_price: number;
  warehouses: string[];
}

export interface ProductDisplay {
  name: string;
  sku: string;
  price: number;
  warehouses: string[];
  description?: string;
}

export interface AddPricePayload {
  warehouse_id: number;
  supplier_id: number;
  product_id: number;
  supplier_price: number;
  lead_time_days?: number;
  maximum_capacity?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductManagementService {
  // API URLs
  private readonly PRODUCT_LIST_API_URL =
    'http://127.0.0.1:8001/api/warehouse/supplier-product/prices/';
  private readonly ADD_OR_UPDATE_PRICE_API_URL =
    'http://127.0.0.1:8001/api/warehouse/supplier-product/add_or_update/';

  constructor(private http: HttpClient) {}

  // Get supplier ID from token
  get supplierId(): number {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return 0;
      }
      const decoded: any = jwtDecode(token);
      if (!decoded || !decoded.user_id) {
        console.error('User ID not found in token');
        return 0;
      }
      return decoded.user_id;
    } catch (error) {
      console.error('Failed to decode authentication token:', error);
      return 0;
    }
  }

  // Fetch supplier's products from the API
  getSupplierProducts(): Observable<ProductDisplay[]> {
    const apiUrl = `${this.PRODUCT_LIST_API_URL}?supplier_id=${this.supplierId}`;

    return this.http.get<ApiProductListItem[]>(apiUrl).pipe(
      map((apiDataArray) =>
        apiDataArray.map((apiItem) => ({
          name: apiItem.product_name,
          sku: apiItem.SKU,
          price: apiItem.supplier_price,
          warehouses: apiItem.warehouses || [],
        }))
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching supplier products:', error);
        return of([]);
      })
    );
  }

  // Add or update product price
  addOrUpdateProductPrice(payload: AddPricePayload): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http
      .post(this.ADD_OR_UPDATE_PRICE_API_URL, payload, httpOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error adding/updating product price:', error);
          return throwError(() => error);
        })
      );
  }
}

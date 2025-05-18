import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

// Interface for the data structure from your API
export interface ApiRequestItem {
  request_id: number;
  supplier_id: number;
  created_at: string;
  expected_delivery_date: string;
  product_id: number;
  count: number;
  status: 'pending' | 'accepted' | 'rejected' | 'received' | 'returned';
  received_at: string | null;
  warehouse_id: number;
  unit_price: number | null;
  quality: string | null;
  is_defective: boolean | null;
  supplier_name: string;
  product_name: string;
}

// Interface for display and component logic
export interface RequestItem {
  id: number;
  requestDate: Date;
  productName: string;
  quantity: number;
  deadline: Date;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Received' | 'Returned';
  receivedAt: Date | null;
  rawApiData?: ApiRequestItem;
  supplierId?: number;
  productId?: number;
  warehouseId?: number;
  unitPrice?: number | null;
  quality?: string | null;
  isDefective?: boolean | null;
  supplierName?: string;
}

export interface JWTPayload {
  user_id: number;
  username: string;
  role_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class CurrentRequestService {
  private readonly ORDER_MANAGEMENT_API_BASE_URL =
    'http://localhost:8000/api/v0/supplier-request';

  constructor(private http: HttpClient) {}

  // Get supplier ID from token
  getSupplierId(): number {
    let supplierId = 1; // Default fallback
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        console.log('Decoded token:', decoded);
        supplierId = decoded?.user_id || 1;
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.warn('No token found, using fallback supplierId.');
    }

    return supplierId;
  }

  // Get supplier requests
  getSupplierRequests(supplierId: number): Observable<RequestItem[]> {
    return this.http
      .get<ApiRequestItem[]>(
        `${this.ORDER_MANAGEMENT_API_BASE_URL}/supplier/${supplierId}/`
      )
      .pipe(
        map((apiDataArray) =>
          apiDataArray.map((apiItem) =>
            this.transformApiItemToRequestItem(apiItem)
          )
        ),
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching requests:', error);
          return of([]); // Return empty array on error
        })
      );
  }

  // Update request status (accept/reject)
  updateRequestStatus(
    requestId: number,
    newStatus: 'accepted' | 'rejected'
  ): Observable<any> {
    const updateUrl = `${this.ORDER_MANAGEMENT_API_BASE_URL}/${requestId}/status/`;

    return this.http.patch(updateUrl, { status: newStatus }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error updating request ${requestId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Transform API response to component-friendly format
  private transformApiItemToRequestItem(apiItem: ApiRequestItem): RequestItem {
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return {
      id: apiItem.request_id,
      requestDate: new Date(apiItem.created_at),
      productName: apiItem.product_name,
      quantity: apiItem.count,
      deadline: new Date(apiItem.expected_delivery_date),
      status: capitalize(apiItem.status) as RequestItem['status'],
      receivedAt: apiItem.received_at ? new Date(apiItem.received_at) : null,
      rawApiData: apiItem,
      supplierId: apiItem.supplier_id,
      productId: apiItem.product_id,
      warehouseId: apiItem.warehouse_id,
      unitPrice: apiItem.unit_price,
      quality: apiItem.quality,
      isDefective: apiItem.is_defective,
      supplierName: apiItem.supplier_name,
    };
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

// Interface for the data structure coming from the API
export interface ApiInventoryItem {
  product_name: string;
  SKU: string;
  warehouse: string;
  Quantity_on_hand: number;
}

// Interface for the transformed inventory items used in components
export interface InventoryItem {
  productName: string;
  sku: string;
  warehouseLocation: string;
  quantity: number;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly BASE_API_URL =
    'http://localhost:8001/api/warehouse/supplier-dashboard/';

  constructor(private http: HttpClient) {}

  /**
   * Get supplier ID from JWT token
   */
  getSupplierId(): number {
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

  /**
   * Fetch inventory data for a supplier
   */
  getInventory(supplierId: number): Observable<InventoryItem[]> {
    const apiUrl = `${this.BASE_API_URL}?supplier_id=${supplierId}`;

    return this.http.get<ApiInventoryItem[]>(apiUrl).pipe(
      map((apiData) => this.transformInventoryData(apiData)),
      catchError(this.handleError)
    );
  }

  /**
   * Transform API data to component-friendly format and calculate status
   */
  private transformInventoryData(apiData: ApiInventoryItem[]): InventoryItem[] {
    return apiData.map((apiItem) => {
      let currentStatus: 'Available' | 'Low Stock' | 'Out of Stock';
      const quantity = apiItem.Quantity_on_hand;

      if (quantity === 0) {
        currentStatus = 'Out of Stock';
      } else if (quantity > 0 && quantity <= 150000) {
        currentStatus = 'Low Stock';
      } else {
        currentStatus = 'Available';
      }

      return {
        productName: apiItem.product_name,
        sku: apiItem.SKU,
        warehouseLocation: apiItem.warehouse,
        quantity: quantity,
        status: currentStatus,
      };
    });
  }

  /**
   * Handle HTTP errors and return empty array to avoid breaking the UI
   */
  private handleError(error: HttpErrorResponse): Observable<InventoryItem[]> {
    console.error('Error fetching inventory data:', error);
    return of([]);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = 'http://localhost:8001/api/warehouse/inventory';

  constructor(private http: HttpClient) {}

  getWarehouseInventory(warehouseId?: number): Observable<any> {
    // If warehouse ID is not provided, try to get it from the token
    if (!warehouseId) {
      const warehouseIdFromToken = this.getWarehouseIdFromToken();
      if (warehouseIdFromToken !== null) {
        warehouseId = warehouseIdFromToken;
      }
    }

    // If we still don't have a warehouse ID, use a default (can be removed in production)
    if (!warehouseId) {
      console.log('No warehouse ID found. Using default ID 1.');
      warehouseId = 1;
    }

    return this.http.get(`${this.apiUrl}/?warehouse_id=${warehouseId}`).pipe(
      catchError((error) => {
        console.error('Error fetching warehouse inventory:', error);
        return of({
          warehouse_city: 'Error',
          warehouse_capacity: 0,
          minimum_stock_level: 0,
          last_restocked: 'N/A',
          current_stock_level: 0,
          inventory_product_details: [],
        });
      })
    );
  }

  private getWarehouseIdFromToken(): number | null {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.warn('No authentication token found');
        return null;
      }

      const decodedToken: any = jwtDecode(token);
      console.log('Decoded token:', decodedToken);

      if (!decodedToken || !decodedToken.warehouse_id) {
        console.warn('Token does not contain warehouse_id');
        return null;
      }

      return decodedToken.warehouse_id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface OrderProduct {
  product_name: string;
  product_count: number;
}

export interface Order {
  order_id: string;
  products: OrderProduct[];
}

export interface InventoryItem {
  product_name: string;
  available_count: number;
}

export interface OrderResponse {
  orders: Order[];
  inventory: InventoryItem[];
}

@Injectable({
  providedIn: 'root',
})
export class VendorOrderService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getOrders(warehouseId: number): Observable<OrderResponse> {
    // Make the real API call to the backend
    return this.http
      .get<OrderResponse>(
        `${this.apiUrl}/warehouse/order-inventory-summary/?warehouse_id=${warehouseId}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching orders:', error);
          // Fallback to mock data if the API call fails
          return of(this.getMockOrderData());
        })
      );
  }

  acceptOrder(
    orderId: string,
    products: OrderProduct[],
    warehouseId: number
  ): Observable<{ success: boolean; message: string }> {
    // Create the payload as expected by the backend
    const payload = {
      order_id: orderId,
      warehouse_id: warehouseId,
      status: 'accepted',
      products: products,
    };
    console.log('Payload for accepting order:', payload);
    return this.http
      .post<any>(`${this.apiUrl}/warehouse/order/handle/`, payload)
      .pipe(
        catchError((error) => {
          console.error(`Error accepting order ${orderId}:`, error);
          return of({
            success: false,
            message:
              error.error?.error ||
              `Error accepting order: ${error.message || 'Unknown error'}`,
          });
        })
      );
  }

  rejectOrder(
    orderId: string,
    warehouseId: number
  ): Observable<{ success: boolean; message: string }> {
    // Create the payload as expected by the backend
    const payload = {
      order_id: orderId,
      warehouse_id: warehouseId,
      status: 'rejected',
    };

    return this.http
      .post<any>(`${this.apiUrl}/warehouse/order/handle/`, payload)
      .pipe(
        catchError((error) => {
          console.error(`Error rejecting order ${orderId}:`, error);
          return of({
            success: false,
            message:
              error.error?.error ||
              `Error rejecting order: ${error.message || 'Unknown error'}`,
          });
        })
      );
  }

  // Mock data method for fallback
  private getMockOrderData(): OrderResponse {
    return {
      orders: [
        {
          order_id: 'ORD100',
          products: [
            {
              product_name: 'Black Pepper',
              product_count: 69,
            },
            {
              product_name: 'Cloves',
              product_count: 48,
            },
          ],
        },
        {
          order_id: 'ORD101',
          products: [
            {
              product_name: 'Nutmeg',
              product_count: 30,
            },
            {
              product_name: 'Ginger Powder',
              product_count: 87,
            },
          ],
        },
        {
          order_id: 'ORD102',
          products: [
            {
              product_name: 'Mustard Seeds',
              product_count: 30,
            },
          ],
        },
        {
          order_id: 'ORD103',
          products: [
            {
              product_name: 'Cardamom',
              product_count: 93,
            },
          ],
        },
        {
          order_id: 'ORD104',
          products: [
            {
              product_name: 'Turmeric Powder',
              product_count: 80,
            },
            {
              product_name: 'Cloves',
              product_count: 61,
            },
            {
              product_name: 'Nutmeg',
              product_count: 47,
            },
            {
              product_name: 'Ginger Powder',
              product_count: 79,
            },
          ],
        },
        {
          order_id: 'ORD105',
          products: [
            {
              product_name: 'Nutmeg',
              product_count: 105,
            },
            {
              product_name: 'Coriander Seeds',
              product_count: 78,
            },
          ],
        },
        {
          order_id: 'ORD106',
          products: [
            {
              product_name: 'Ginger Powder',
              product_count: 121,
            },
            {
              product_name: 'Nutmeg',
              product_count: 46,
            },
            {
              product_name: 'Mustard Seeds',
              product_count: 29,
            },
            {
              product_name: 'Turmeric Powder',
              product_count: 146,
            },
          ],
        },
        {
          order_id: 'ORD107',
          products: [
            {
              product_name: 'Turmeric Powder',
              product_count: 69,
            },
          ],
        },
        {
          order_id: 'ORD108',
          products: [
            {
              product_name: 'Ginger Powder',
              product_count: 30,
            },
            {
              product_name: 'Cloves',
              product_count: 109,
            },
            {
              product_name: 'Nutmeg',
              product_count: 77,
            },
          ],
        },
        {
          order_id: 'ORD109',
          products: [
            {
              product_name: 'Nutmeg',
              product_count: 143,
            },
            {
              product_name: 'Coriander Seeds',
              product_count: 68,
            },
            {
              product_name: 'Cinnamon Sticks',
              product_count: 81,
            },
          ],
        },
      ],
      inventory: [
        {
          product_name: 'Black Pepper',
          available_count: 10,
        },
        {
          product_name: 'Cinnamon Sticks',
          available_count: 206,
        },
        {
          product_name: 'Cardamom',
          available_count: 289,
        },
        {
          product_name: 'Turmeric Powder',
          available_count: 63,
        },
        {
          product_name: 'Cloves',
          available_count: 297,
        },
        {
          product_name: 'Nutmeg',
          available_count: 235,
        },
        {
          product_name: 'Ginger Powder',
          available_count: 259,
        },
        {
          product_name: 'Mustard Seeds',
          available_count: 171,
        },
        {
          product_name: 'Fenugreek',
          available_count: 203,
        },
        {
          product_name: 'Coriander Seeds',
          available_count: 95,
        },
      ],
    };
  }
}

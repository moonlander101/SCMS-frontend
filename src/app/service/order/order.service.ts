// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';

export interface OrderProduct {
  product_id: number;
  count: number;
  unit_price: number;
  product_name: string;
}

export interface OrderDetails {
  warehouse_id: number;
  warehouse_name: string;
  latitude: string;
  longitude: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  instructions: string;
}

export interface OrderResponse {
  order_id: number;
  user_id: number;
  status: string;
  created_at: string;
  products: OrderProduct[];
  details: OrderDetails;
}

// Add this new interface for order creation
export interface CreateOrderRequest {
  user_id: number;
  details: {
    warehouse_id: number;
    warehouse_name: string;
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    latitude: string;
    longitude: string;
    instructions?: string;
  };
  products: {
    product_id: number;
    count: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // API URLs - for when the backend is available
  private baseUrl = 'http://127.0.0.1:8000/api/v0/orders';

  // Flag to control using mock data vs real API
  private useMockData = false; // Set to false when your API is ready

  constructor(private http: HttpClient) {}

  getOrdersByVendorId(vendorId: number): Observable<OrderResponse[]> {
    // For development, use mock data
    if (this.useMockData) {
      console.log('Using mock data for orders');
      return this.getMockOrders();
    }

    // When ready to use real API
    return this.http
      .get<OrderResponse[]>(`${this.baseUrl}/vendor/${vendorId}/`)
      .pipe(
        catchError((error) => {
          console.error('API request failed:', error);
          return this.getMockOrders();
        })
      );
  }

  // Mock data for development
  getMockOrders(): Observable<OrderResponse[]> {
    console.log('Returning mock order data');

    // Sample mock data matching your API structure
    const mockData: OrderResponse[] = [
      {
        order_id: 75,
        user_id: 1,
        status: 'pending',
        created_at: '2025-05-16T17:04:07.233292Z',
        products: [
          {
            product_id: 1,
            count: 2,
            unit_price: 1324.79,
            product_name: 'Pepper Product 1',
          },
          {
            product_id: 2,
            count: 1,
            unit_price: 1990.68,
            product_name: 'Cinnamon Product 2',
          },
        ],
        details: {
          warehouse_id: 1,
          latitude: '40.7128',
          longitude: '-74.0060',
          warehouse_name: 'Colombo Central',
          first_name: 'Himath',
          last_name: 'Samarakoon',
          phone: '0711729704',
          address: '27/20',
          city: 'Colombo',
          state: 'Dehiwala',
          zipcode: '10552',
          instructions: '',
        },
      },
      {
        order_id: 76,
        user_id: 1,
        status: 'accepted',
        created_at: '2025-05-16T17:41:39.166453Z',
        products: [
          {
            product_id: 1,
            count: 2,
            unit_price: 1324.79,
            product_name: 'Pepper Product 1',
          },
          {
            product_id: 2,
            count: 1,
            unit_price: 1990.68,
            product_name: 'Cinnamon Product 2',
          },
        ],
        details: {
          warehouse_id: 1,
          latitude: '40.7128',
          longitude: '-74.0060',
          warehouse_name: 'Colombo Central',
          first_name: 'Himath',
          last_name: 'Samarakoon',
          phone: '0711729704',
          address: '27/20',
          city: 'Colombo',
          state: 'Dehiwala',
          zipcode: '10552',
          instructions: '',
        },
      },
      {
        order_id: 77,
        user_id: 1,
        status: 'shipped',
        created_at: '2025-05-15T14:30:00.000000Z',
        products: [
          {
            product_id: 3,
            count: 3,
            unit_price: 2150.25,
            product_name: 'Cardamom Premium',
          },
        ],
        details: {
          warehouse_id: 2,
          latitude: '41.8781',
          longitude: '-87.6298',
          warehouse_name: 'Kandy Depot',
          first_name: 'Himath',
          last_name: 'Samarakoon',
          phone: '0711729704',
          address: '27/20',
          city: 'Colombo',
          state: 'Dehiwala',
          zipcode: '10552',
          instructions: 'Please call before delivery',
        },
      },
      {
        order_id: 78,
        user_id: 1,
        status: 'delivered',
        created_at: '2025-05-10T09:15:30.000000Z',
        products: [
          {
            product_id: 4,
            count: 1,
            unit_price: 3250.5,
            product_name: 'Cloves Organic',
          },
          {
            product_id: 5,
            count: 2,
            unit_price: 1875.3,
            product_name: 'Nutmeg Ground',
          },
        ],
        details: {
          warehouse_id: 3,
          latitude: '42.3601',
          longitude: '-71.0589',
          warehouse_name: 'Kurunegala Rock',
          first_name: 'Himath',
          last_name: 'Samarakoon',
          phone: '0711729704',
          address: '27/20',
          city: 'Colombo',
          state: 'Dehiwala',
          zipcode: '10552',
          instructions: '',
        },
      },
      {
        order_id: 79,
        user_id: 1,
        status: 'rejected',
        created_at: '2025-05-10T09:15:30.000000Z',
        products: [
          {
            product_id: 4,
            count: 1,
            unit_price: 3250.5,
            product_name: 'Cloves Organic',
          },
          {
            product_id: 5,
            count: 2,
            unit_price: 1875.3,
            product_name: 'Nutmeg Ground',
          },
        ],
        details: {
          warehouse_id: 3,
          latitude: '42.3601',
          longitude: '-71.0589',
          warehouse_name: 'Kurunegala Rock',
          first_name: 'Himath',
          last_name: 'Samarakoon',
          phone: '0711729704',
          address: '27/20',
          city: 'Colombo',
          state: 'Dehiwala',
          zipcode: '10552',
          instructions: '',
        },
      },
    ];

    return of(mockData);
  }

  // Add this method to your OrderService class
  createOrder(orderData: CreateOrderRequest): Observable<any> {
    // Validate product IDs before sending
    const hasInvalidProductIds = orderData.products.some(
      (p: any) => p.product_id === null || p.product_id === undefined
    );

    if (hasInvalidProductIds) {
      console.error('Invalid product IDs detected in order data:', orderData);
      return throwError(() => new Error('Order contains invalid product IDs'));
    }

    console.log('Order Created and Send:', orderData);
    return this.http.post<any>(`${this.baseUrl}/`, orderData).pipe(      
      catchError((error) => {
        console.error('Error creating order:', error);
        return throwError(
          () => new Error('Failed to create order. Please try again.')
        );
      })
    );
  }
}

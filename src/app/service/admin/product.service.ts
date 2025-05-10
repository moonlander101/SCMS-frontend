import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  product_SKU: string;
  product_name: string;
  unit_price: string;
  created_at: string;
  updated_at: string;
  category: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/product/products/';

  // Mock data for products
  private mockProducts: Product[] = [
    {
      id: 1,
      product_SKU: 'SKU001',
      product_name: 'Chili Product 1',
      unit_price: '1360.02',
      created_at: '2025-05-08T22:55:30.882872Z',
      updated_at: '2025-05-08T22:55:30.882888Z',
      category: 4,
    },
    {
      id: 2,
      product_SKU: 'SKU002',
      product_name: 'Cinnamon Product 2',
      unit_price: '1177.24',
      created_at: '2025-05-08T22:55:31.222029Z',
      updated_at: '2025-05-08T22:55:31.222043Z',
      category: 1,
    },
    {
      id: 3,
      product_SKU: 'SKU003',
      product_name: 'Pepper Product 3',
      unit_price: '1679.32',
      created_at: '2025-05-08T22:55:31.598300Z',
      updated_at: '2025-05-08T22:55:31.598313Z',
      category: 2,
    },
    {
      id: 4,
      product_SKU: 'SKU004',
      product_name: 'Cinnamon Product 4',
      unit_price: '1075.60',
      created_at: '2025-05-08T22:55:31.959594Z',
      updated_at: '2025-05-08T22:55:31.959607Z',
      category: 1,
    },
    {
      id: 5,
      product_SKU: 'SKU005',
      product_name: 'Chili Product 5',
      unit_price: '1711.09',
      created_at: '2025-05-08T22:55:32.341762Z',
      updated_at: '2025-05-08T22:55:32.341776Z',
      category: 4,
    },
    {
      id: 6,
      product_SKU: 'SKU006',
      product_name: 'Cinnamon Product 6',
      unit_price: '641.30',
      created_at: '2025-05-08T22:55:32.650508Z',
      updated_at: '2025-05-08T22:55:32.650521Z',
      category: 1,
    },
    {
      id: 7,
      product_SKU: 'SKU007',
      product_name: 'Pepper Product 7',
      unit_price: '1549.53',
      created_at: '2025-05-08T22:55:32.953223Z',
      updated_at: '2025-05-08T22:55:32.953237Z',
      category: 2,
    },
    {
      id: 8,
      product_SKU: 'SKU008',
      product_name: 'Pepper Product 8',
      unit_price: '1622.30',
      created_at: '2025-05-08T22:55:33.246637Z',
      updated_at: '2025-05-08T22:55:33.246648Z',
      category: 2,
    },
    {
      id: 9,
      product_SKU: 'SKU009',
      product_name: 'Chili Product 9',
      unit_price: '112.31',
      created_at: '2025-05-08T22:55:33.593378Z',
      updated_at: '2025-05-08T22:55:33.593389Z',
      category: 4,
    },
    {
      id: 10,
      product_SKU: 'SKU010',
      product_name: 'Cinnamon Product 10',
      unit_price: '367.99',
      created_at: '2025-05-08T22:55:33.996954Z',
      updated_at: '2025-05-08T22:55:33.996965Z',
      category: 1,
    },
  ];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    // For development, return mock data
    return of(this.mockProducts);

    // For production, uncomment this line:
    // return this.http.get<Product[]>(this.apiUrl).pipe(
    //   catchError(this.handleError<Product[]>('getProducts', []))
    // );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // Get category name by ID
  getCategoryName(categoryId: number): string {
    switch (categoryId) {
      case 1:
        return 'Cinnamon';
      case 2:
        return 'Pepper';
      case 4:
        return 'Chili';
      default:
        return 'Unknown';
    }
  }
}

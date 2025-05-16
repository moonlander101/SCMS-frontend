import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiProduct {
  id: number;
  product_SKU: string;
  product_name: string;
  unit_price: string;
  category: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiCategory {
  id: number;
  category_name: string;
  description: string;
}

export interface Product {
  name: string;
  subtitle: string;
  price: number;
  category: number;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/product/';

  constructor(private http: HttpClient) {}

  // Fetch all products from the API
  getProducts(): Observable<ApiProduct[]> {
    console.log('Fetching products from API...');
    return this.http.get<ApiProduct[]>(`${this.apiUrl}products/`);
  }

  // Fetch all categories from the API
  getCategories(): Observable<ApiCategory[]> {
    console.log('Fetching categories from API...');
    return this.http.get<ApiCategory[]>(`${this.apiUrl}categories/`);
  }

  // You can implement methods for filtering and sorting if needed
  filterProductsByCategory(products: Product[], category: number): Product[] {
    return products.filter((product) => product.category === category);
  }
}

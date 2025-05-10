import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiProduct {
    id: number;
    product_SKU: string;
    product_name: string;
   
    unit_price: string;
    category: number;
  }

//   "id": 1,
// "product_SKU": "SKU001",
// "product_name": "Cardamom Product 1",
// "unit_price": "1257.29",
// "created_at": "2025-05-07T14:36:06.635310Z",
// "updated_at": "2025-05-07T14:36:06.635332Z",
// "category": 3
  
  export interface Product {
    name: string;
    subtitle: string;
    price: number;
    category: number; // keep it number
    image: string;
  }
  
  

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/product/products/'; // Your API endpoint

  constructor(private http: HttpClient) {}

  // Fetch all products from the API
  getProducts(): Observable<ApiProduct[]> {
    console.log('Fetching products from API...');
    return this.http.get<ApiProduct[]>(this.apiUrl);

    }
  // You can implement methods for filtering and sorting if needed
  // Example of category filter method
  filterProductsByCategory(products: Product[], category: number): Product[] {
   
    return products.filter(product => product.category === category);
  }
  
  

  
}

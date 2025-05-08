import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = 'http://localhost:8000/api/warehouse/inventory';

  constructor(private http: HttpClient) {}

  getWarehouseInventory(warehouseId: number): Observable<any> {
    // Using hardcoded data until backend is built
    // Return different mock data based on warehouse ID for testing
    // if (warehouseId === 1) {
    //   return of({
    //     warehouse_city: 'Kurunegala Rock',
    //     warehouse_capacity: 12000000.0,
    //     minimum_stock_level: 3000000.0,
    //     last_restocked: '2025-05-05',
    //     current_stock_level: 7209701.56,
    //     inventory_product_details: [
    //       {
    //         product_name: 'Cardamom Product 1',
    //         category: 'Cardamom',
    //         supplied_by: 'Supplier A',
    //         supplied_date: '2025-05-07',
    //         product_count: 383912,
    //       },
    //       {
    //         product_name: 'Cardamom Product 2',
    //         category: 'Cardamom',
    //         supplied_by: 'Supplier B',
    //         supplied_date: '2025-05-07',
    //         product_count: 381563,
    //       },
    //       {
    //         product_name: 'Cardamom Product 3',
    //         category: 'Cardamom',
    //         supplied_by: 'Supplier C',
    //         supplied_date: '2025-05-07',
    //         product_count: 120560,
    //       },
    //       {
    //         product_name: 'Cinnamon Product 1',
    //         category: 'Cinnamon',
    //         supplied_by: 'Supplier A',
    //         supplied_date: '2025-05-04',
    //         product_count: 985600,
    //       },
    //       {
    //         product_name: 'Pepper Product 1',
    //         category: 'Pepper',
    //         supplied_by: 'Supplier D',
    //         supplied_date: '2025-05-03',
    //         product_count: 1458900,
    //       },
    //       {
    //         product_name: 'Clove Product 1',
    //         category: 'Cloves',
    //         supplied_by: 'Supplier B',
    //         supplied_date: '2025-05-02',
    //         product_count: 758000,
    //       },
    //       {
    //         product_name: 'Nutmeg Product 1',
    //         category: 'Nutmeg',
    //         supplied_by: 'Supplier C',
    //         supplied_date: '2025-05-01',
    //         product_count: 321450,
    //       },
    //       {
    //         product_name: 'Turmeric Product 1',
    //         category: 'Turmeric',
    //         supplied_by: 'Supplier A',
    //         supplied_date: '2025-04-28',
    //         product_count: 2800000,
    //       },
    //     ],
    //   });
    // } else {
    //   // Default data for any other warehouse ID with new format
    //   return of({
    //     warehouse_city: 'Unknown',
    //     warehouse_capacity: 5000000.0,
    //     minimum_stock_level: 1000000.0,
    //     last_restocked: '2025-04-30',
    //     current_stock_level: 3500000.0,
    //     inventory_product_details: [
    //       {
    //         product_name: 'Sample Product',
    //         category: 'General',
    //         supplied_by: 'Default Supplier',
    //         supplied_date: '2025-04-30',
    //         product_count: 3500000,
    //       },
    //     ],
    //   });
    // }

    // Comment out the actual API call for now - uncomment when backend is ready
    warehouseId = 1; // Hardcoded for testing
    return this.http.get(`${this.apiUrl}/?warehouse_id=${warehouseId}`);
  }
}

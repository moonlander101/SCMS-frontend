import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Warehouse {
  id: number;
  location_x: string;
  location_y: string;
  warehouse_name: string;
  capacity: string;
  created_at: string;
}

export interface InventoryProductDetail {
  product_name: string;
  category: string;
  supplied_by: string;
  supplied_date: string;
  product_count: number;
}

export interface WarehouseInventory {
  warehouse_city: string;
  capacity: number;
  last_restocked: string;
  current_stock_level: number;
  inventory_product_details: InventoryProductDetail[];
}

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private warehousesUrl = 'http://127.0.0.1:8000/api/warehouse/warehouses/';
  private inventoryUrl = 'http://127.0.0.1:8000/api/warehouse/inventory/';

  constructor(private http: HttpClient) {}

  // Fetch all warehouses from the API
  getWarehouses(): Observable<Warehouse[]> {
    console.log('Fetching warehouses from API...');
    return this.http.get<Warehouse[]>(this.warehousesUrl);
  }

  // Fetch inventory for a specific warehouse
  getWarehouseInventory(warehouseId: number): Observable<WarehouseInventory> {
    console.log(`Fetching inventory for warehouse ID: ${warehouseId}`);
    return this.http.get<WarehouseInventory>(`${this.inventoryUrl}?warehouse_id=${warehouseId}`);
  }
}
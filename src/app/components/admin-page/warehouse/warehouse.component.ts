import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WarehouseService, Warehouse, WarehouseInventory, InventoryProductDetail } from '../../../service/warehouse/warehouse.service';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  warehouses: Warehouse[] = [];
  inventoryData: WarehouseInventory | null = null;
  inventoryProducts: InventoryProductDetail[] = [];
  selectedWarehouse: Warehouse | null = null;
  loading = false;
  searchQuery = '';
  filteredWarehouses: Warehouse[] = [];
  
  // For inventory view
  inventoryLoading = false;
  inventorySearchQuery = '';
  filteredInventoryProducts: InventoryProductDetail[] = [];

  constructor(private warehouseService: WarehouseService) { }

  ngOnInit(): void {
    this.loadWarehouses();
  }

  // Add this method to make parseFloat available in the template
  parseFloat(value: string): number {
    return parseFloat(value);
  }

  loadWarehouses(): void {
    this.loading = true;
    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouses = data;
        this.filteredWarehouses = [...this.warehouses];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading warehouses', error);
        this.loading = false;
      }
    });
  }

  selectWarehouse(warehouse: Warehouse): void {
    this.selectedWarehouse = warehouse;
    this.loadInventory(warehouse.id);
  }

  loadInventory(warehouseId: number): void {
    this.inventoryLoading = true;
    this.warehouseService.getWarehouseInventory(warehouseId).subscribe({
      next: (data) => {
        this.inventoryData = data;
        this.inventoryProducts = data.inventory_product_details;
        this.filteredInventoryProducts = [...this.inventoryProducts];
        this.inventoryLoading = false;
      },
      error: (error) => {
        console.error('Error loading inventory', error);
        this.inventoryLoading = false;
      }
    });
  }

  backToWarehouses(): void {
    this.selectedWarehouse = null;
    this.inventoryData = null;
    this.inventoryProducts = [];
  }

  filterWarehouses(): void {
    if (!this.searchQuery.trim()) {
      this.filteredWarehouses = [...this.warehouses];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredWarehouses = this.warehouses.filter(warehouse => 
      warehouse.warehouse_name.toLowerCase().includes(query) ||
      warehouse.location_x.toLowerCase().includes(query) || 
      warehouse.location_y.toLowerCase().includes(query)
    );
  }

  filterInventory(): void {
    if (!this.inventorySearchQuery.trim()) {
      this.filteredInventoryProducts = [...this.inventoryProducts];
      return;
    }
    
    const query = this.inventorySearchQuery.toLowerCase();
    this.filteredInventoryProducts = this.inventoryProducts.filter(item => 
      item.product_name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.supplied_by.toLowerCase().includes(query)
    );
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }
}
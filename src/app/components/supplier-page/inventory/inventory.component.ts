import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

// Optional: Define an interface for better type safety
interface InventoryItem {
  productName: string;
  sku: string;
  warehouseLocation: string;
  quantity: number;
  status: string; // Or a specific type like 'Available' | 'Low Stock'
  // Add any other properties your items have
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})

// Implement OnInit if you fetch data when the component loads
export class InventoryComponent implements OnInit {

  // --- ADD THIS LINE ---
  // Initialize as an empty array. Use 'any[]' for now, or the interface
  inventoryItems: InventoryItem[] = [];
  // OR if you don't want strict typing yet:
  // inventoryItems: any[] = [];

  // Constructor (Inject services here if needed)
  constructor(/* private inventoryService: InventoryService */) { }

  // ngOnInit is a good place to fetch initial data
  ngOnInit(): void {
    this.loadInventory(); // Call a method to load data
  }

  loadInventory(): void {
    // Here you would typically call a service to get the data
    // For example:
    // this.inventoryService.getInventory().subscribe(data => {
    //   this.inventoryItems = data;
    // });

    // --- TEMPORARY Placeholder Data (Remove when using a service) ---
    this.inventoryItems = [
      { productName: 'Turmeric Powder', sku: 'LP123', warehouseLocation: 'Main WH', quantity: 50, status: 'Available' },
      { productName: 'Garam Masala', sku: 'WM456', warehouseLocation: 'Main WH', quantity: 5, status: 'Low Stock' },
      { productName: 'Cinnamon Sticks', sku: 'KB789', warehouseLocation: 'Secondary WH', quantity: 0, status: 'Out of Stock' }
    ];
    // --- END Placeholder ---
  }

  // ... other methods if needed

}

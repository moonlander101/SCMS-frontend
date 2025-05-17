import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  InventoryService,
  InventoryItem,
} from '../../../service/supplier/inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.inventoryItems = []; // Clear previous items

    const supplierId = this.inventoryService.getSupplierId();

    if (!supplierId) {
      this.errorMessage = 'Unable to identify supplier. Please log in again.';
      this.isLoading = false;
      return;
    }

    this.inventoryService.getInventory(supplierId).subscribe({
      next: (data) => {
        this.inventoryItems = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error in component while loading inventory:', error);
        this.errorMessage =
          'Failed to load inventory data. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  // Additional UI-related methods can be added here
  getStatusClass(status: string): string {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

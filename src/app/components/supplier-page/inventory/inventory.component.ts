import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable, of } from 'rxjs'; // Import Observable and of for error handling
import { catchError, map } from 'rxjs/operators'; // Import operators
import { jwtDecode } from 'jwt-decode';

// Interface for the data structure coming from your API
interface ApiInventoryItem {
  product_name: string;
  SKU: string;
  warehouse: string;
  Quantity_on_hand: number;
}

interface InventoryItem {
  productName: string;
  sku: string;
  warehouseLocation: string;
  quantity: number;
  status: 'Available' | 'Low Stock' | 'Out of Stock'; // Specific status types
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})

export class InventoryComponent implements OnInit {

  inventoryItems: InventoryItem[] = [];
  isLoading: boolean = false; // To show a loading indicator
  errorMessage: string | null = null; // To display any API errors

  // API URL -
  // In a real app, the base URL and supplier_id might come from environment variables or a service
  private get supplierId(): number {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          return 0;
        }
        const decoded: any = jwtDecode(token);
        if (!decoded || !decoded.user_id) {
          console.error('User ID not found in token');
          return 0;
        }
        return decoded.user_id;
      } catch (error) {
        console.error('Failed to decode authentication token:', error);
        return 0;
      }
    }
  private apiUrl = `http://localhost:8000/api/warehouse/supplier-dashboard/?supplier_id=${this.supplierId}`;

  constructor(private http: HttpClient) { } // Inject HttpClient

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.inventoryItems = []; // Clear previous items

    this.http.get<ApiInventoryItem[]>(this.apiUrl).pipe(
      map(apiData => {
        // Transform API data to our InventoryItem structure and calculate status
        return apiData.map(apiItem => {
          let currentStatus: 'Available' | 'Low Stock' | 'Out of Stock';
          const quantity = apiItem.Quantity_on_hand;

          if (quantity === 0) {
            currentStatus = 'Out of Stock';
          } else if (quantity > 0 && quantity <= 150000) { // Between 0 (exclusive) and 150000 (inclusive)
            currentStatus = 'Low Stock';
          } else { // quantity > 150000
            currentStatus = 'Available';
          }

          return {
            productName: apiItem.product_name,
            sku: apiItem.SKU,
            warehouseLocation: apiItem.warehouse,
            quantity: quantity,
            status: currentStatus
          };
        });
      }),
      catchError(error => {
        console.error('Error fetching inventory data:', error);
        this.errorMessage = 'Failed to load inventory data. Please try again later.';
        return of([]); // Return an empty array on error to prevent breaking the UI
      })
    ).subscribe({
      next: (processedData) => {
        this.inventoryItems = processedData;
        this.isLoading = false;
      },
      error: () => {
        // Error handling is already done in catchError, but you can add more here if needed
        this.isLoading = false;
      }
    });
  }
}

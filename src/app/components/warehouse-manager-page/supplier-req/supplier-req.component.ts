import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  SupplierRequestService,
  SupplierRequest,
} from '../../../service/order/supplier-request.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-supplier-req',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule, // Add this import
  ],
  templateUrl: './supplier-req.component.html',
  styleUrl: './supplier-req.component.css',
})
export class SupplierReqComponent implements OnInit {
  requests: SupplierRequest[] = [];
  filteredRequests: SupplierRequest[] = [];
  currentWarehouseId = 1; // This would come from authentication or route param
  filterType = 'pending'; // Default filter to show only pending requests

  // Add these new filter properties
  supplierFilter: string = ''; // For supplier dropdown
  dateFilter: string = ''; // For date input
  searchQuery: string = ''; // For search field

  // Store list of available suppliers for dropdown
  suppliers: string[] = [];

  constructor(
    private supplierRequestService: SupplierRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.supplierRequestService.getAllRequests().subscribe((data) => {
      this.requests = data;

      // Extract unique suppliers for the dropdown
      this.extractSuppliers();

      // Apply initial filters
      this.applyFilters();
    });
  }

  extractSuppliers(): void {
    // Get unique supplier names for the dropdown
    const uniqueSuppliers = new Set(
      this.requests
        .filter((req) => req.supplier_name) // Filter out any undefined
        .map((req) => req.supplier_name)
    );
    this.suppliers = Array.from(uniqueSuppliers);
  }

  applyFilters(): void {
    // Start with all requests for the current warehouse
    let filtered = this.requests.filter(
      (req) => req.warehouse_id === this.currentWarehouseId
    );

    // Apply status filter if needed
    if (this.filterType === 'pending') {
      filtered = filtered.filter((req) => req.status === 'pending');
    }

    // Apply supplier filter if selected
    if (this.supplierFilter) {
      filtered = filtered.filter(
        (req) => req.supplier_name === this.supplierFilter
      );
    }

    // Apply date filter if selected
    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter).toISOString().split('T')[0];
      filtered = filtered.filter((req) => {
        // Filter by created_at date
        return req.created_at === filterDate;
      });
    }

    // Apply search filter if entered
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((req) => {
        // Search in product name, supplier name, and request id
        return (
          (req.product_name &&
            req.product_name.toLowerCase().includes(query)) ||
          (req.supplier_name &&
            req.supplier_name.toLowerCase().includes(query)) ||
          (req.request_id && req.request_id.toString().includes(query))
        );
      });
    }

    this.filteredRequests = filtered;
  }

  // Handler for the status filter dropdown
  onFilterChange(): void {
    this.applyFilters();
  }

  // Handler for the search input field
  onSearchInput(): void {
    this.applyFilters();
  }

  // Handler for applying all filters (button click)
  applyAllFilters(): void {
    this.applyFilters();
  }

  // Handler for clearing all filters
  clearFilters(): void {
    this.filterType = 'pending';
    this.supplierFilter = '';
    this.dateFilter = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  viewDetails(requestId: number): void {
    // Navigate to the survey page with the request id
    this.router.navigate([
      '/dashboard/warehouse/supplier-request-survey',
      requestId,
    ]);
  }

  viewOrderDetails(requestId: number, event: Event): void {
    // Prevent the row click from also triggering
    event.stopPropagation();

    // Navigate to the survey page with the request id
    this.router.navigate([
      '/dashboard/warehouse/supplier-request-survey',
      requestId,
    ]);
  }

  markAsCompleted(request: SupplierRequest, event: Event): void {
    event.stopPropagation(); // Prevent row click navigation

    this.supplierRequestService
      .markAsCompleted(request.request_id)
      .subscribe((updatedRequest) => {
        console.log(`Marked request ${updatedRequest.request_id} as completed`);
        this.applyFilters(); // Re-apply filters to update the view
      });
  }

  getTotalPrice(request: SupplierRequest): number {
    return request.count * request.unit_price;
  }

  // Methods for stat cards
  getPendingRequestsCount(): number {
    return this.filteredRequests.filter((req) => req.status === 'pending')
      .length;
  }

  getReceivedRequestsCount(): number {
    return this.filteredRequests.filter((req) => req.status === 'received')
      .length;
  }

  getTotalOrderValue(): string {
    const total = this.filteredRequests.reduce((sum, request) => {
      return sum + request.count * request.unit_price;
    }, 0);
    return total.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  getUniqueProductCount(): number {
    const uniqueProducts = new Set(
      this.filteredRequests.map((request) => request.product_name)
    );
    return uniqueProducts.size;
  }
}

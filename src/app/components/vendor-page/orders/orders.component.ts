import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Order {
  id: string;
  date: Date;
  itemsCount: number;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
}

interface User {
  name: string;
  // Add other user properties as needed
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  // User data
  user: User = {
    name: 'John Doe'
  };

  // Orders data
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pageNumbers: number[] = [];
  paginationStart: number = 0;
  paginationEnd: number = 0;

  // Filters
  searchQuery: string = '';
  statusFilter: string = 'all';
  dateFilter: string = 'all';

  constructor() {}

  ngOnInit(): void {
    // Load mock order data
    this.loadMockOrders();
    this.filterOrders();
    this.calculatePagination();
  }

  loadMockOrders(): void {
    // Mock data for demonstration
    this.orders = [
      {
        id: '1001',
        date: new Date(2025, 3, 15), // April 15, 2025
        itemsCount: 3,
        total: 129.99,
        status: 'delivered'
      },
      {
        id: '1002',
        date: new Date(2025, 4, 1), // May 1, 2025
        itemsCount: 1,
        total: 49.99,
        status: 'shipped',
        trackingNumber: 'TRACK123456'
      },
      {
        id: '1003',
        date: new Date(2025, 4, 5), // May 5, 2025
        itemsCount: 2,
        total: 89.98,
        status: 'processing'
      },
      {
        id: '1004',
        date: new Date(2025, 3, 10), // April 10, 2025
        itemsCount: 4,
        total: 159.96,
        status: 'cancelled'
      },
      {
        id: '1005',
        date: new Date(2025, 2, 20), // March 20, 2025
        itemsCount: 2,
        total: 79.98,
        status: 'delivered'
      },
      {
        id: '1006',
        date: new Date(2025, 1, 15), // February 15, 2025
        itemsCount: 1,
        total: 29.99,
        status: 'delivered'
      },
      {
        id: '1007',
        date: new Date(2025, 4, 3), // May 3, 2025
        itemsCount: 3,
        total: 109.97,
        status: 'shipped',
        trackingNumber: 'TRACK789012'
      }
    ];
  }

  filterOrders(): void {
    let filtered = [...this.orders];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.status === this.statusFilter
      );
    }

    // Apply date filter
    if (this.dateFilter !== 'all') {
      const today = new Date();
      const daysAgo = parseInt(this.dateFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(today.getDate() - daysAgo);
      
      filtered = filtered.filter(order => 
        order.date >= cutoffDate
      );
    }

    this.filteredOrders = filtered;
    this.currentPage = 1; // Reset to first page when filters change
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    
    // Generate page numbers array
    this.pageNumbers = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumbers.push(i);
    }
    
    // Calculate items showing
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginationStart = startIndex + 1;
    this.paginationEnd = Math.min(startIndex + this.itemsPerPage, this.filteredOrders.length);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.calculatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.calculatePagination();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.calculatePagination();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.dateFilter = 'all';
    this.filterOrders();
  }

  canTrack(order: Order): boolean {
    return (order.status === 'shipped' || order.status === 'processing') && 
           !!order.trackingNumber;
  }

  trackOrder(orderId: string): void {
    // This would typically navigate to a tracking page or open a modal
    const order = this.orders.find(o => o.id === orderId);
    if (order?.trackingNumber) {
      alert(`Tracking order #${orderId} with tracking number: ${order.trackingNumber}`);
      // In a real application, you would implement proper tracking functionality
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'processing':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800';
      case 'shipped':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800';
      case 'cancelled':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800';
      default:
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
    }
  }
}
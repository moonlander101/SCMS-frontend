import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService, OrderResponse } from '../../../service/order/order.service';

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
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  user: User = { name: 'John Doe' };

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  pageNumbers: number[] = [];
  paginationStart = 0;
  paginationEnd = 0;

  searchQuery = '';
  statusFilter = 'all';
  dateFilter = 'all';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrdersFromServer(2); // You can pass vendor ID dynamically
  }

  loadOrdersFromServer(vendorId: number): void {
    this.orderService.getOrdersByVendorId(vendorId).subscribe({
      next: (data: OrderResponse[]) => {
        this.orders = data.map(order => ({
          id: order.order_id.toString(),
          date: new Date(order.created_at),
          itemsCount: order.products.reduce((sum, p) => sum + p.count, 0),
          total: order.products.reduce((sum, p) => sum + (p.unit_price * p.count), 0),
          status: this.mapStatus(order.status),
          trackingNumber: order.blockchain_tx_id
        }));
        this.filterOrders();
        this.calculatePagination();
      },
      error: err => {
        console.error('Error fetching orders:', err);
      }
    });
  }

  mapStatus(apiStatus: string): 'processing' | 'shipped' | 'delivered' | 'cancelled' {
    const status = apiStatus.toLowerCase();
    if (status.includes('pending')) return 'processing';
    if (status.includes('shipped')) return 'shipped';
    if (status.includes('delivered')) return 'delivered';
    if (status.includes('cancelled')) return 'cancelled';
    return 'processing';
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
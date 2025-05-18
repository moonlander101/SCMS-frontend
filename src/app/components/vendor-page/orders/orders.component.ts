import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  OrderService,
  OrderResponse,
} from '../../../service/order/order.service';
import { jwtDecode } from 'jwt-decode';

interface Product {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface DeliveryDetails {
  warehouseId: number;
  warehouseName: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  instructions: string;
  coordinates: {
    lat: string;
    lng: string;
  };
}

interface TrackingStatus {
  processing: Date | null;
  shipped: Date | null;
  delivered: Date | null;
}

interface Order {
  id: string;
  date: Date;
  itemsCount: number;
  total: number;
  status: string;
  products: Product[];
  deliveryDetails: DeliveryDetails;
  trackingStatus: TrackingStatus | null;
}

interface User {
  name: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  user: User = { name: 'Customer' };

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

  // Order details modal
  selectedOrder: Order | null = null;
  showOrderDetails = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    const vendorId = this.getVendorIdFromToken();
    this.loadOrdersFromServer(vendorId);
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload: any = jwtDecode(token);
        // Set user name if available in token
        if (payload.name) {
          this.user.name = payload.name;
        }
      } catch (error) {
        console.error('Error parsing user info from token:', error);
      }
    }
  }

  private getVendorIdFromToken(): number {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No authentication token found');
      return 0;
    }

    try {
      // Decode the JWT token payload
      const payload: any = jwtDecode(token);
      return payload.user_id;
    } catch (error) {
      console.error('Error parsing authentication token:', error);
      return 0;
    }
  }

  loadOrdersFromServer(vendorId: number): void {
    this.orderService.getOrdersByVendorId(vendorId).subscribe({
      next: (data: OrderResponse[]) => {
        this.orders = data.map((order) => {
          // Map products using the new product_name field
          const products = order.products.map((p) => ({
            id: p.product_id,
            name: p.product_name, // Use the product_name from API
            quantity: p.count,
            unitPrice: p.unit_price,
          }));

          // Calculate total
          const total = products.reduce(
            (sum, p) => sum + p.unitPrice * p.quantity,
            0
          );

          // Map delivery details using all the new fields from the API
          const deliveryDetails: DeliveryDetails = {
            warehouseId: order.details.warehouse_id,
            warehouseName: order.details.warehouse_name,
            firstName: order.details.first_name,
            lastName: order.details.last_name,
            phone: order.details.phone,
            address: order.details.address,
            city: order.details.city,
            state: order.details.state,
            zipCode: order.details.zipcode,
            instructions: order.details.instructions,
            coordinates: {
              lat: order.details.latitude,
              lng: order.details.longitude,
            },
          };

          // Generate mock tracking status based on order status
          const trackingStatus = this.generateMockTrackingStatus(
            order.status,
            new Date(order.created_at)
          );

          return {
            id: order.order_id.toString(),
            date: new Date(order.created_at),
            itemsCount: products.reduce((sum, p) => sum + p.quantity, 0),
            total: total,
            status: order.status.toLowerCase(),
            products: products,
            deliveryDetails: deliveryDetails,
            trackingStatus: trackingStatus,
          };
        });

        this.filterOrders();
        this.calculatePagination();
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      },
    });
  }

  // Generate mock tracking status for demonstration
  generateMockTrackingStatus(status: string, orderDate: Date): TrackingStatus {
    const result: TrackingStatus = {
      processing: null, // We'll keep the property name for compatibility
      shipped: null,
      delivered: null,
    };

    // Simulate processing starts 1 day after order
    const processingDate = new Date(orderDate);
    processingDate.setDate(processingDate.getDate() + 1);

    // Simulate shipping 2 days after order
    const shippedDate = new Date(orderDate);
    shippedDate.setDate(shippedDate.getDate() + 2);

    // Simulate delivery 5 days after order
    const deliveredDate = new Date(orderDate);
    deliveredDate.setDate(deliveredDate.getDate() + 5);

    // Set dates based on status
    if (status.toLowerCase() === 'pending') {
      // Just ordered, no processing yet
      return result;
    } else if (status.toLowerCase() === 'accepted') {
      // Changed from 'processing'
      result.processing = processingDate;
    } else if (status.toLowerCase() === 'shipped') {
      result.processing = processingDate;
      result.shipped = shippedDate;
    } else if (status.toLowerCase() === 'delivered') {
      result.processing = processingDate;
      result.shipped = shippedDate;
      result.delivered = deliveredDate;
    } else if (status.toLowerCase() === 'rejected') {
      // For rejected orders, we set processing date (when it was reviewed)
      // but no further progress dates
      result.processing = processingDate;
    }

    return result;
  }

  filterOrders(): void {
    let filtered = [...this.orders];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((order) =>
        order.id.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === this.statusFilter);
    }

    // Apply date filter
    if (this.dateFilter !== 'all') {
      const today = new Date();
      const daysAgo = parseInt(this.dateFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(today.getDate() - daysAgo);

      filtered = filtered.filter((order) => order.date >= cutoffDate);
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
    this.paginationStart = this.filteredOrders.length > 0 ? startIndex + 1 : 0;
    this.paginationEnd = Math.min(
      startIndex + this.itemsPerPage,
      this.filteredOrders.length
    );
  }

  // Get paginated orders for current page
  paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredOrders.slice(start, end);
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

  // Order Details Modal
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeOrderDetails(): void {
    this.showOrderDetails = false;
  }

  formatDate(date: Date | null): string {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStatusClass(status: string, size: 'sm' | 'lg' = 'sm'): string {
    const baseClasses =
      size === 'sm'
        ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
        : 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';

    switch (status) {
      case 'pending':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'accepted': // Changed from 'accepted'
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'shipped':
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      case 'delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  // Helper methods for tracking timeline
  isStatusCompleted(status: string): boolean {
    if (!this.selectedOrder?.trackingStatus) return false;

    switch (status) {
      case 'processing':
        return !!this.selectedOrder.trackingStatus.processing;
      case 'shipped':
        return !!this.selectedOrder.trackingStatus.shipped;
      case 'delivered':
        return !!this.selectedOrder.trackingStatus.delivered;
      default:
        return false;
    }
  }

  isStatusActive(status: string): boolean {
    if (!this.selectedOrder?.trackingStatus) return false;

    switch (status) {
      case 'processing':
        return (
          !!this.selectedOrder.trackingStatus.processing &&
          !this.selectedOrder.trackingStatus.shipped
        );
      case 'shipped':
        return (
          !!this.selectedOrder.trackingStatus.shipped &&
          !this.selectedOrder.trackingStatus.delivered
        );
      case 'delivered':
        return !!this.selectedOrder.trackingStatus.delivered;
      default:
        return false;
    }
  }

  isStatusPending(status: string): boolean {
    return !this.isStatusCompleted(status) && !this.isStatusActive(status);
  }

  getStatusDate(status: string): Date | null {
    if (!this.selectedOrder?.trackingStatus) return null;

    switch (status) {
      case 'processing':
        return this.selectedOrder.trackingStatus.processing;
      case 'shipped':
        return this.selectedOrder.trackingStatus.shipped;
      case 'delivered':
        return this.selectedOrder.trackingStatus.delivered;
      default:
        return null;
    }
  }
}

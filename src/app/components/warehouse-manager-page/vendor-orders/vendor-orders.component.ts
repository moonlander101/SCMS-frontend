import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  VendorOrderService,
  Order,
  OrderProduct,
  InventoryItem,
} from '../../../service/order/vendor-order.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [VendorOrderService],
  templateUrl: './vendor-orders.component.html',
  styleUrl: './vendor-orders.component.css',
})
export class VendorOrdersComponent implements OnInit {
  orders: Order[] = [];
  inventory: InventoryItem[] = [];
  isLoading = true;
  expandedOrderId: string | null = null;
  warehouseId = 1; // Hardcoded for now
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Filtering options
  searchQuery = '';
  filterFulfillable: 'all' | 'fulfillable' | 'insufficient' = 'all';
  sortBy: 'newest' | 'oldest' | 'products-high' | 'products-low' = 'newest';
  activeTab: 'all' | 'pending' | 'accepted' | 'rejected' = 'all';

  constructor(private vendorOrderService: VendorOrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.vendorOrderService.getOrders(this.warehouseId).subscribe({
      next: (data) => {
        this.orders = data.orders;
        this.inventory = data.inventory;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  toggleOrderDetails(orderId: string): void {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    } else {
      this.expandedOrderId = orderId;
    }
  }

  acceptOrder(orderId: string, event: Event): void {
    event.stopPropagation();

    // Find the order details before removing from list
    const orderToAccept = this.orders.find(
      (order) => order.order_id === orderId
    );

    if (!orderToAccept) {
      this.errorMessage = `Order ${orderId} not found`;
      setTimeout(() => (this.errorMessage = null), 5000);
      return;
    }

    // Log the order details to console with status "accepted"
    console.log('Accepting order with details:', {
      order_id: orderToAccept.order_id,
      status: 'accepted',
      products: orderToAccept.products.map((product) => ({
        product_name: product.product_name,
        product_count: product.product_count,
      })),
    });

    // Current implementation with hardcoded warehouse ID
    // In a real implementation, we would extract the warehouse ID from the JWT token in localStorage
    // const token = localStorage.getItem('token');
    // const decodedToken = jwt_decode(token);
    // const warehouseId = decodedToken.warehouse_id;
    const warehouseId = 1; // Hardcoded for now

    this.vendorOrderService
      .acceptOrder(orderId, orderToAccept.products, warehouseId)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = response.message;
            this.orders = this.orders.filter(
              (order) => order.order_id !== orderId
            );
            setTimeout(() => (this.successMessage = null), 5000);
          } else {
            this.errorMessage = response.message;
            setTimeout(() => (this.errorMessage = null), 5000);
          }
        },
        error: (error) => {
          console.error('Error accepting order:', error);
          this.errorMessage = 'Failed to accept order. Please try again.';
          setTimeout(() => (this.errorMessage = null), 5000);
        },
      });
  }

  rejectOrder(orderId: string, event: Event): void {
    event.stopPropagation();

    // Log only the order_id with status "rejected"
    console.log('Rejecting order:', {
      order_id: orderId,
      status: 'rejected',
    });

    // In a real implementation, we would extract the warehouse ID from the JWT token in localStorage
    // const token = localStorage.getItem('token');
    // const decodedToken = jwt_decode(token);
    // const warehouseId = decodedToken.warehouse_id;
    const warehouseId = 1; // Hardcoded for now

    this.vendorOrderService.rejectOrder(orderId, warehouseId).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.message;
          this.orders = this.orders.filter(
            (order) => order.order_id !== orderId
          );
          setTimeout(() => (this.successMessage = null), 5000);
        } else {
          this.errorMessage = response.message;
          setTimeout(() => (this.errorMessage = null), 5000);
        }
      },
      error: (error) => {
        console.error('Error rejecting order:', error);
        this.errorMessage = 'Failed to reject order. Please try again.';
        setTimeout(() => (this.errorMessage = null), 5000);
      },
    });
  }

  getInventoryStatus(
    product: OrderProduct
  ): 'sufficient' | 'insufficient' | 'exact' {
    const inventoryItem = this.inventory.find(
      (item) => item.product_name === product.product_name
    );

    if (!inventoryItem) {
      return 'insufficient';
    }

    if (inventoryItem.available_count > product.product_count) {
      return 'sufficient';
    } else if (inventoryItem.available_count === product.product_count) {
      return 'exact';
    } else {
      return 'insufficient';
    }
  }

  getInventoryCount(productName: string): number {
    const inventoryItem = this.inventory.find(
      (item) => item.product_name === productName
    );
    return inventoryItem ? inventoryItem.available_count : 0;
  }

  canFulfillOrder(order: Order): boolean {
    return order.products.every((product) => {
      const status = this.getInventoryStatus(product);
      return status === 'sufficient' || status === 'exact';
    });
  }

  getTotalProductCount(order: Order): number {
    return order.products.reduce(
      (sum, product) => sum + product.product_count,
      0
    );
  }

  get filteredOrders(): Order[] {
    return this.orders
      .filter((order) => {
        // Filter by fulfillable status
        if (
          this.filterFulfillable === 'fulfillable' &&
          !this.canFulfillOrder(order)
        ) {
          return false;
        }

        if (
          this.filterFulfillable === 'insufficient' &&
          this.canFulfillOrder(order)
        ) {
          return false;
        }

        // Filter by search query
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          const matchesOrderId = order.order_id.toLowerCase().includes(query);
          const matchesProducts = order.products.some((p) =>
            p.product_name.toLowerCase().includes(query)
          );

          if (!matchesOrderId && !matchesProducts) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Sort orders
        switch (this.sortBy) {
          case 'newest':
            return a.order_id < b.order_id ? 1 : -1; // Simple simulation using order ID
          case 'oldest':
            return a.order_id > b.order_id ? 1 : -1;
          case 'products-high':
            return this.getTotalProductCount(b) - this.getTotalProductCount(a);
          case 'products-low':
            return this.getTotalProductCount(a) - this.getTotalProductCount(b);
          default:
            return 0;
        }
      });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterFulfillable = 'all';
    this.sortBy = 'newest';
    this.activeTab = 'all';
  }

  getProductFulfillmentPercentage(order: Order): number {
    const total = order.products.length;
    if (total === 0) return 0;

    const fulfillable = order.products.filter((product) => {
      const status = this.getInventoryStatus(product);
      return status === 'sufficient' || status === 'exact';
    }).length;

    return Math.round((fulfillable / total) * 100);
  }

  // Accept order
  onAcceptOrder(order: Order): void {
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.vendorOrderService
      .acceptOrder(order.order_id, order.products, this.warehouseId)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage =
            response.message || 'Order accepted successfully';
          // Refresh orders after accepting
          this.loadOrders();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Failed to accept order';
        },
      });
  }

  // Reject order
  onRejectOrder(order: Order): void {
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.vendorOrderService
      .rejectOrder(order.order_id, this.warehouseId)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage =
            response.message || 'Order rejected successfully';
          // Refresh orders after rejecting
          this.loadOrders();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Failed to reject order';
        },
      });
  }
}

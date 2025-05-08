import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  VendorOrderService,
  Order,
  OrderProduct,
  InventoryItem,
} from '../../../service/order/vendor-order.service';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

    /**
     * ACTUAL BACKEND IMPLEMENTATION (when ready):
     *
     * Step 1: Update the VendorOrderService to accept complete order details
     * ----------------------------------------------------------------------
     * // In vendor-order.service.ts:
     * acceptOrder(orderDetails: Order): Observable<{ success: boolean; message: string }> {
     *   // Send complete order information to backend
     *   return this.http.post<{success: boolean; message: string}>(
     *     `${this.apiUrl}/orders/accept`,
     *     {
     *       order_id: orderDetails.order_id,
     *       status: "accepted",
     *       products: orderDetails.products,
     *       warehouse_id: this.warehouseId
     *     }
     *   );
     * }
     *
     * Step 2: Call the updated service here with complete order information
     * --------------------------------------------------------------------
     * this.vendorOrderService.acceptOrder(orderToAccept).subscribe({
     *   next: (response) => {
     *     if (response.success) {
     *       this.successMessage = response.message;
     *       this.orders = this.orders.filter(order => order.order_id !== orderToAccept.order_id);
     *       // After successful acceptance, update inventory counts
     *       this.updateInventoryCounts(orderToAccept);
     *       setTimeout(() => (this.successMessage = null), 5000);
     *     } else {
     *       this.errorMessage = response.message;
     *       setTimeout(() => (this.errorMessage = null), 5000);
     *     }
     *   },
     *   error: (error) => {
     *     console.error('Error accepting order:', error);
     *     this.errorMessage = 'Failed to accept order. Please try again.';
     *     setTimeout(() => (this.errorMessage = null), 5000);
     *   }
     * });
     *
     * Step 3: Create helper method to update inventory counts locally
     * --------------------------------------------------------------
     * private updateInventoryCounts(order: Order): void {
     *   order.products.forEach(product => {
     *     const inventoryItem = this.inventory.find(item => item.product_name === product.product_name);
     *     if (inventoryItem) {
     *       inventoryItem.available_count -= product.product_count;
     *     }
     *   });
     * }
     */

    // Current implementation with only order ID
    this.vendorOrderService.acceptOrder(orderId).subscribe({
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

    /**
     * ACTUAL BACKEND IMPLEMENTATION (when ready):
     *
     * Step 1: Update the VendorOrderService to include rejection status
     * ----------------------------------------------------------------
     * // In vendor-order.service.ts:
     * rejectOrder(orderId: string): Observable<{ success: boolean; message: string }> {
     *   // Send order ID with rejection status to backend
     *   return this.http.post<{success: boolean; message: string}>(
     *     `${this.apiUrl}/orders/reject`,
     *     {
     *       order_id: orderId,
     *       status: "rejected",
     *       warehouse_id: this.warehouseId
     *     }
     *   );
     * }
     */

    // Current implementation with only order ID
    this.vendorOrderService.rejectOrder(orderId).subscribe({
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
}

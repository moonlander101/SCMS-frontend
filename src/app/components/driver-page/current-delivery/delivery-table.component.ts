// delivery-table.component.ts
import { Component, OnInit } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { TitleCasePipe, DatePipe } from '@angular/common';

interface AssignmentItem {
  shipment: {
    id: number;
    order_id: string;
    demand: number;
    status: string;
  };
  role: 'driver' | 'helper' | 'pickup' | 'delivery';
  delivery_sequence: number;
  delivery_location: {
    lat: number;
    lon: number;
  };
  is_delivered: boolean;
  delivered_at: string | null;
}

interface Assignment {
  id: number;
  vehicle: string;
  total_load: number;
  status: string;
  items: AssignmentItem[];
}

@Component({
  selector: 'app-delivery-table',
  templateUrl: './delivery-table.component.html',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, TitleCasePipe, DatePipe]
})
export class DeliveryTableComponent implements OnInit {
  assignment: Assignment | null = null;
  deliveryItems: AssignmentItem[] = [];
  currentIndex = 0;
  allDeliveriesCompleted = false;
  confirmAllDeliveriesCompleted = false;
  selectedItem: AssignmentItem | null = null;
  showOrderDetails = false;

  // Properties for confirmation modal
  showConfirmationModal = false;
  itemToConfirm: number | null = null;

  constructor() { }  ngOnInit(): void {
    // Mock data - this would typically come from a service
    this.assignment = {
      id: 1,
      vehicle: 'TRK001',
      total_load: 500,
      status: 'created',
      items: [
        {
          shipment: {
            id: 1,
            order_id: 'ORD001',
            demand: 500,
            status: 'pending'
          },
          role: 'pickup',
          delivery_sequence: 1,          delivery_location: {
            lat: 7.2,
            lon: 80.1 // Note: JSON had 'lng', changed to 'lon' to match interface
          },
          is_delivered: true,
          delivered_at: "2024/12/12"
        },
        {
          shipment: {
            id: 1,
            order_id: 'ORD001',
            demand: 500,
            status: 'pending'
          },
          role: 'delivery',
          delivery_sequence: 2,          delivery_location: {
            lat: 7.3,
            lon: 80.2 // Note: JSON had 'lng', changed to 'lon' to match interface
          },
          is_delivered: false,
          delivered_at: null
        }
      ]
    };    // Sort delivery items by sequence
    this.deliveryItems = [...this.assignment.items].sort((a, b) =>
      a.delivery_sequence - b.delivery_sequence
    );

    // Initialize currentIndex based on first non-delivered item
    const firstNonDeliveredIndex = this.deliveryItems.findIndex(item => !item.is_delivered);
    this.currentIndex = firstNonDeliveredIndex !== -1 ? firstNonDeliveredIndex : 0;

    // Check if all deliveries are completed
    this.allDeliveriesCompleted = !this.deliveryItems.some(item => !item.is_delivered);

    // Update assignment status if all items are delivered
    if (this.allDeliveriesCompleted && this.assignment) {
      this.assignment.status = 'completed';
    }
  }// Confirms the current delivery and unlocks the next one
  confirmDelivery(index: number): void {
    if (index !== this.currentIndex) {
      return; // Can only confirm the current active delivery item
    }

    // Mark the current delivery item as delivered
    const item = this.deliveryItems[index];
    item.is_delivered = true;
    item.delivered_at = new Date().toISOString();
    item.shipment.status = 'delivered';

    if (index < this.deliveryItems.length - 1) {
      this.currentIndex++;
    } else {
      this.allDeliveriesCompleted = true;
      if (this.assignment) {
        this.assignment.status = 'completed';
      }
    }

    // Close details view if it was open for this item
    if (this.selectedItem && this.selectedItem.shipment.id === item.shipment.id) {
      this.closeOrderDetails();
    }
  }  // Called when driver completes all deliveries
  completeAllDeliveries(): void {
    if (!this.allDeliveriesCompleted) {
      return; // All deliveries must be confirmed first
    }

    // Here you would typically send data to backend service
    alert('All deliveries completed successfully!');
    this.confirmAllDeliveriesCompleted = true;
    this.closeOrderDetails(); // Close any open details

    // Additional logic to reset or move to next batch of deliveries
    // could be implemented here
  }
  // Helper method to check if a row can be confirmed
  canConfirm(index: number): boolean {
    return index === this.currentIndex && !this.allDeliveriesCompleted;
  }

  // Find delivery item index by ID
  findDeliveryIndexById(id: number): number {
    return this.deliveryItems.findIndex(item => item.shipment.id === id);
  }

  // Can confirm by ID - used in the modal
  canConfirmById(id: number): boolean {
    const index = this.findDeliveryIndexById(id);
    return this.canConfirm(index);
  }

  // Confirm delivery by ID - used in the modal
  confirmDeliveryById(id: number): void {
    const index = this.findDeliveryIndexById(id);
    this.confirmDelivery(index);
  }

  // Opens the order details view for a specific item
  viewOrderDetails(item: AssignmentItem, event: Event): void {
    // Prevent triggering the row click when clicking the confirm button
    if ((event.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }

    this.selectedItem = item;
    this.showOrderDetails = true;
  }

  // Closes the order details view
  closeOrderDetails(): void {
    this.selectedItem = null;
    this.showOrderDetails = false;
  }  // Calculate the total demand for an assignment
  calculateTotalDemand(items: AssignmentItem[]): number {
    return items.reduce((total, item) => total + item.shipment.demand, 0);
  }

  // Open confirmation modal before confirming delivery
  openConfirmationModal(index: number, event: Event): void {
    event.stopPropagation(); // Prevent the row click event
    if (this.canConfirm(index)) {
      this.itemToConfirm = index;
      this.showConfirmationModal = true;
    }
  }

  // Close confirmation modal
  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.itemToConfirm = null;
  }

  // Confirm after modal approval
  confirmAfterApproval(): void {
    if (this.itemToConfirm !== null) {
      this.confirmDelivery(this.itemToConfirm);
      this.closeConfirmationModal();
    }
  }
}

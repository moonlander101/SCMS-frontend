// delivery-table.component.ts
import { Component, OnInit } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { TitleCasePipe, DatePipe } from '@angular/common';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface DeliveryLocation {
  id: number;
  address: string;
  status: 'pending' | 'confirmed';
  timestamp?: Date;
  customerName: string;
  phoneNumber: string;
  orderItems: OrderItem[];
  deliveryNotes?: string;
  totalAmount: number;
}

@Component({
  selector: 'app-delivery-table',
  templateUrl: './delivery-table.component.html',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, TitleCasePipe, DatePipe]
})
export class DeliveryTableComponent implements OnInit {
  deliveryLocations: DeliveryLocation[] = [];
  currentIndex = 0;
  allDeliveriesCompleted = false;
  confirmAllDeliveriesCompleted = false;
  selectedLocation: DeliveryLocation | null = null;
  showOrderDetails = false;

  constructor() { }

  ngOnInit(): void {
    // Mock data - this would typically come from a service
    this.deliveryLocations = [
      {
        id: 1,
        address: '123 Main St, Suite 101',
        status: 'pending',
        customerName: 'John Smith',
        phoneNumber: '(555) 123-4567',
        orderItems: [
          { id: 'item1', name: 'Package A', quantity: 2, price: 45.99 },
          { id: 'item2', name: 'Package B', quantity: 1, price: 29.99 }
        ],
        deliveryNotes: 'Leave at reception desk',
        totalAmount: 121.97
      },
      {
        id: 2,
        address: '456 Oak Ave, Building A',
        status: 'pending',
        customerName: 'Sarah Johnson',
        phoneNumber: '(555) 234-5678',
        orderItems: [
          { id: 'item3', name: 'Document Envelope', quantity: 1, price: 15.50 }
        ],
        deliveryNotes: 'Signature required',
        totalAmount: 15.50
      },
      {
        id: 3,
        address: '789 Pine Rd, Unit 5',
        status: 'pending',
        customerName: 'Michael Davis',
        phoneNumber: '(555) 345-6789',
        orderItems: [
          { id: 'item4', name: 'Electronics Package', quantity: 1, price: 299.99 },
          { id: 'item5', name: 'Office Supplies', quantity: 3, price: 24.99 }
        ],
        totalAmount: 374.96
      },
      {
        id: 4,
        address: '321 Cedar Blvd, Shop 22',
        status: 'pending',
        customerName: 'Emily Wilson',
        phoneNumber: '(555) 456-7890',
        orderItems: [
          { id: 'item6', name: 'Furniture Delivery', quantity: 1, price: 599.99 }
        ],
        deliveryNotes: 'Heavy item - use dolly',
        totalAmount: 599.99
      },
      {
        id: 5,
        address: '654 Maple Dr, Office 303',
        status: 'pending',
        customerName: 'Robert Brown',
        phoneNumber: '(555) 567-8901',
        orderItems: [
          { id: 'item7', name: 'Medical Supplies', quantity: 2, price: 89.50 },
          { id: 'item8', name: 'Lab Equipment', quantity: 1, price: 349.99 }
        ],
        deliveryNotes: 'Handle with care',
        totalAmount: 528.99
      }
    ];
  }

  // Confirms the current delivery and unlocks the next one
  confirmDelivery(index: number): void {
    if (index !== this.currentIndex) {
      return; // Can only confirm the current active location
    }

    this.deliveryLocations[index].status = 'confirmed';
    this.deliveryLocations[index].timestamp = new Date();

    if (index < this.deliveryLocations.length - 1) {
      this.currentIndex++;
    } else {
      this.allDeliveriesCompleted = true;
    }

    // Close details view if it was open for this location
    if (this.selectedLocation && this.selectedLocation.id === this.deliveryLocations[index].id) {
      this.closeOrderDetails();
    }
  }

  // Called when driver completes all deliveries
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

  // Find delivery location index by ID
  findDeliveryIndexById(id: number): number {
    return this.deliveryLocations.findIndex(loc => loc.id === id);
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

  // Opens the order details view for a specific location
  viewOrderDetails(location: DeliveryLocation, event: Event): void {
    // Prevent triggering the row click when clicking the confirm button
    if ((event.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }

    this.selectedLocation = location;
    this.showOrderDetails = true;
  }

  // Closes the order details view
  closeOrderDetails(): void {
    this.selectedLocation = null;
    this.showOrderDetails = false;
  }

  // Calculate the total for an order
  calculateOrderTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  }
}

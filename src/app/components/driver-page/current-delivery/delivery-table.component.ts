// delivery-table.component.ts
import { Component, OnInit } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { DriverService } from '../../../service/driver/driver.service';
import { jwtDecode } from 'jwt-decode';

export interface AssignmentItem {
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
    lng: number;
  };
  is_delivered: boolean;
  delivered_at: string | null;
}

export interface Assignment {
  id: number;
  vehicle: string;
  total_load: number;
  status: string;
  providers : [DriverService],
  items: AssignmentItem[];
}

@Component({
  selector: 'app-delivery-table',
  templateUrl: './delivery-table.component.html',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, TitleCasePipe, DatePipe],
  providers : [DriverService],
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

  constructor(private driverService: DriverService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    let vehicleId = "TRK002"; // Default fallback
    
    if (token) {
      try {
        // Use jwt-decode to parse the token
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded token:', decodedToken);
        
        // Extract vehicle ID
        if (decodedToken.vehicle_id) {
          vehicleId = decodedToken.vehicle_id;
          console.log('Using vehicle ID from token:', vehicleId);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.warn('No token found, using default vehicle ID');
    }

    this.driverService.fetchAssignmentsByVehicle(vehicleId).subscribe({
      next: (data) => {
        this.assignment = data as Assignment;
        console.log('Assignment fetched:', this.assignment);

        this.deliveryItems = [...this.assignment.items].sort((a, b) =>
          a.delivery_sequence - b.delivery_sequence
        );

        // Initialize currentIndex based on first non-delivered item
        const firstNonDeliveredIndex = this.deliveryItems.findIndex(item => !item.is_delivered);
        console.log("First non-delivered index:", firstNonDeliveredIndex);

        // Check if all items are delivered
        this.allDeliveriesCompleted = firstNonDeliveredIndex === -1;

        // If all items are delivered, set currentIndex to a value that won't match any row
        // Otherwise, set it to the first non-delivered item
        this.currentIndex = this.allDeliveriesCompleted ? -1 : firstNonDeliveredIndex;

        // Update assignment status if all items are delivered
        if (this.allDeliveriesCompleted && this.assignment) {
          this.assignment.status = 'completed';
        }
      },
      error: (err) => {
        console.error('Error fetching assignment:', err);
      }
    });
  }

  // Confirms the current delivery and unlocks the next one
confirmDelivery(index: number): void {
  if (index !== this.currentIndex) {
    return; // Can only confirm the current active delivery item
  }

  const item = this.deliveryItems[index];

  // Call processArrival and wait for its completion before updating UI
  if (this.assignment) {
    // Show loading indicator or disable UI if needed

    // Call markArrival and subscribe to its response
    this.driverService.markArrival(
      this.assignment.id,
      item.delivery_sequence,
      this.assignment.total_load,
      this.assignment.status
    ).subscribe({
        next: (response: any) => {
          console.log('Arrival marked successfully:', response);

          // Check if there are actions to process
          if (response && response.actions && Array.isArray(response.actions)) {
            // Create an array of observables for each action
            const completeRequests = response.actions.map((action: any) => {
              if (action.assignment_item_id) {
                return this.driverService.markComplete(
                  this.assignment!.id,
                  action.assignment_item_id,
                  this.assignment!.total_load,
                  this.assignment!.status
                );
              }
              return null;
            }).filter((req: null) => req !== null);

            // Execute all completion requests
            if (completeRequests.length > 0) {
              // Use forkJoin to wait for all requests to complete
              import('rxjs').then(({ forkJoin, of }) => {
                forkJoin(completeRequests).subscribe({
                  next: (results) => {
                    console.log('All actions completed successfully:', results);

                    // Only update UI state after all API calls are successful
                    this.updateDeliveryState(index, item);
                  },
                  error: (error) => {
                    console.error('Error completing actions:', error);
                    // Handle error (show message to user)
                  }
                });
              });
            } else {
              // No actions to complete
              this.updateDeliveryState(index, item);
            }
          } else {
            // No actions in response, just update the UI
            this.updateDeliveryState(index, item);
          }
        },
        error: (error) => {
          console.error('Error marking arrival:', error);
          // Handle error (show message to user)
        }
      });
    }
  }

  // Helper method to update the local state after API calls complete
  private updateDeliveryState(index: number, item: AssignmentItem): void {
    // Mark the current delivery item as delivered
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

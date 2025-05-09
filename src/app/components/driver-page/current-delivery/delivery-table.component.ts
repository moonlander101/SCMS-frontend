//* delivery-table.component.ts*
import { Component, OnInit } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { TitleCasePipe, DatePipe } from '@angular/common';
interface DeliveryLocation {
  id: number;
  address: string;
  status: 'pending' | 'confirmed';
  timestamp?: Date;
}
@Component({
  selector: 'app-delivery-table',
  templateUrl: './delivery-table.component.html',
  imports: [NgFor, NgClass, NgIf, TitleCasePipe, DatePipe]
})
export class DeliveryTableComponent implements OnInit {
  deliveryLocations: DeliveryLocation[] = [];
  currentIndex = 0;
  allDeliveriesCompleted = false;
  confirmAllDeliveriesCompleted = false;
  constructor() { }
  ngOnInit(): void {
    //* Mock data - this would typically come from a service*
    this.deliveryLocations = [
      { id: 1, address: '123 Main St, Suite 101', status: 'pending' },
      { id: 2, address: '456 Oak Ave, Building A', status: 'pending' },
      { id: 3, address: '789 Pine Rd, Unit 5', status: 'pending' },
      { id: 4, address: '321 Cedar Blvd, Shop 22', status: 'pending' },
      { id: 5, address: '654 Maple Dr, Office 303', status: 'pending' }
    ];
  }
  //* Confirms the current delivery and unlocks the next one*
  confirmDelivery(index: number): void {
    if (index !== this.currentIndex) {
      return; //* Can only confirm the current active location*
    }
    this.deliveryLocations[index].status = 'confirmed';
    this.deliveryLocations[index].timestamp = new Date();
    if (index < this.deliveryLocations.length - 1) {
      this.currentIndex++;
    } else {
      this.allDeliveriesCompleted = true;
    }
  }
  //* Called when driver completes all deliveries*
  completeAllDeliveries(): void {
    if (!this.allDeliveriesCompleted) {
      return; //* All deliveries must be confirmed first*
    }
    //* Here you would typically send data to backend service*
    alert('All deliveries completed successfully!');
    this.confirmAllDeliveriesCompleted = true
    //* Additional logic to reset or move to next batch of deliveries*
    //* could be implemented here*
  }
  //* Helper method to check if a row can be confirmed*
  canConfirm(index: number): boolean {
    return index === this.currentIndex && !this.allDeliveriesCompleted;
  }
}

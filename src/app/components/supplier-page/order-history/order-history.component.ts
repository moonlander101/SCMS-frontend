import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})

export class OrderHistoryComponent implements OnInit {
  orders: any[] = []; // Declare orders property

  constructor() { }

  ngOnInit(): void {
    // Fetch orders here
  }

  // Helper function potentially needed for ngClass
  getOrderStatusClass(status: string): string {
    // Return appropriate CSS class based on status
    switch (status?.toLowerCase()) {
         case 'delivered': return 'bg-green-100 text-green-700';
         case 'shipped': return 'bg-blue-100 text-blue-700';
         case 'confirmed': return 'bg-yellow-100 text-yellow-700';
         case 'pending confirmation': return 'bg-orange-100 text-orange-700';
         case 'cancelled': return 'bg-red-100 text-red-700';
         default: return 'bg-gray-100 text-gray-700';
    }
  }
}
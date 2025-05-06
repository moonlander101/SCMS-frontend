import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- IMPORT THIS

// Interface to define the structure of a request item
interface RequestItem {
  id: string;
  requestDate: Date | string;
  productName: string;
  quantity: number;
  deadline: Date | string;
  status: 'New' | 'Accepted' | 'Rejected' | 'Shipped' | 'Processing';
}

@Component({
  selector: 'app-current-requests',
  standalone: true, // <--- MAKE SURE THIS IS TRUE
  imports: [CommonModule], // <--- ADD THIS IMPORTS ARRAY WITH CommonModule
  templateUrl: './current-requests.component.html',
  styleUrls: ['./current-requests.component.css']
})
export class CurrentRequestsComponent implements OnInit {

  currentRequests: RequestItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadHardcodedRequests();
  }

  loadHardcodedRequests(): void {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // Ensure dates are consistently Dates or consistently strings if needed
    // Using Date objects is generally better for date logic
    this.currentRequests = [
       {
        id: 'PO-1001',
        requestDate: yesterday, // Keep as Date object
        productName: 'Cumin Seeds',
        quantity: 50,
        deadline: tomorrow, // Keep as Date object
        status: 'New'
      },
      {
        id: 'PO-1002',
        requestDate: new Date(new Date().setDate(new Date().getDate() - 5)), // Use new Date() to avoid modifying 'today'
        productName: 'Cloves',
        quantity: 10,
        deadline: nextWeek, // Keep as Date object
        status: 'Accepted'
      },
      {
        id: 'PO-1003',
        requestDate: new Date(new Date().setDate(new Date().getDate() - 10)),
        productName: 'Cinnamon Sticks',
        quantity: 200,
        deadline: yesterday, // Re-use yesterday variable if it's correct scope, or recalculate
        status: 'Processing'
      },
      {
        id: 'PO-1004',
        requestDate: new Date(new Date().setDate(new Date().getDate() - 2)),
        productName: 'Garam Masala',
        quantity: 5,
        deadline: new Date(new Date().setDate(new Date().getDate() + 3)),
        status: 'New'
      },
       {
        id: 'PO-1005',
        requestDate: new Date(new Date().setDate(new Date().getDate() - 15)),
        productName: 'Chili Powder',
        quantity: 25,
        deadline: new Date(new Date().setDate(new Date().getDate() - 8)),
        status: 'Accepted'
      },
      {
        id: 'PO-1006',
        requestDate: new Date(new Date().setDate(new Date().getDate() - 3)),
        productName: 'Cardamom Pods',
        quantity: 30,
        deadline: new Date(new Date().setDate(new Date().getDate() + 10)),
        status: 'Rejected'
      }
    ];
     // It's better to recalculate dates if modifying them in loops/assignments
  }

  isOverdue(deadline: Date | string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline); // Convert string or Date object to Date
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate < today;
  }

  getRequestStatusClass(status: string): string {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-yellow-100 text-yellow-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  acceptRequest(requestId: string): void {
    console.log(`Accepting request: ${requestId}`);
    const request = this.currentRequests.find(r => r.id === requestId);
    if (request) {
       request.status = 'Accepted';
    }
    // TODO: Integrate with backend service and blockchain trigger
  }

  rejectRequest(requestId: string): void {
    console.log(`Rejecting request: ${requestId}`);
     const request = this.currentRequests.find(r => r.id === requestId);
    if (request) {
       request.status = 'Rejected';
    }
    // TODO: Integrate with backend service and blockchain trigger
  }
}
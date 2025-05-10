import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // DatePipe for formatting
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

// Interface for the data structure from your API
interface ApiRequestItem {
  request_id: number;
  supplier_id: number;
  created_at: string; // ISO date string
  expected_delivery_date: string; // ISO date string
  product_id: number;
  count: number;
  status: 'pending' | 'accepted' | 'rejected' | 'received' | 'returned'; // API status values
  received_at: string | null;
  warehouse_id: number;
  unit_price: number | null;
  quality: string | null;
  is_defective: boolean | null;
  supplier_name: string;
  product_name: string;
}

// Your internal interface for display and component logic
interface RequestItem {
  id: number; // request_id
  requestDate: Date;
  productName: string;
  quantity: number;
  deadline: Date;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Received' | 'Returned'; // UI display status
  rawApiData?: ApiRequestItem;
  supplierId?: number;
  productId?: number;
  receivedAt?: Date | null;
  warehouseId?: number;
  unitPrice?: number | null;
  quality?: string | null;
  isDefective?: boolean | null;
  supplierName?: string;
}

@Component({
  selector: 'app-current-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-requests.component.html',
  styleUrls: ['./current-requests.component.css'],
  providers: [DatePipe]
})
export class CurrentRequestsComponent implements OnInit {
  currentRequests: RequestItem[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  selectedRequestDetails: RequestItem | null = null;
  isModalOpen: boolean = false;

  private supplierId = 103; // Example supplier ID - get this dynamically in a real app

  // --- API URL defined directly in the component ---
  private readonly ORDER_MANAGEMENT_API_BASE_URL = 'http://localhost:YOUR_ORDER_API_PORT/api';

  private apiUrl = `${this.ORDER_MANAGEMENT_API_BASE_URL}/supplier-request/supplier/${this.supplierId}`;

  constructor(private http: HttpClient, public datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.currentRequests = [];

    this.http.get<ApiRequestItem[]>(this.apiUrl).pipe(
      map(apiDataArray => {
        return apiDataArray.map(apiItem => this.transformApiItemToRequestItem(apiItem));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching requests:', error);
        this.errorMessage = `Failed to load requests: ${error.statusText || 'Unknown error'}`;
        return of([]);
      })
    ).subscribe({
      next: (processedData) => {
        this.currentRequests = processedData;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private transformApiItemToRequestItem(apiItem: ApiRequestItem): RequestItem {
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return {
      id: apiItem.request_id,
      requestDate: new Date(apiItem.created_at),
      productName: apiItem.product_name,
      quantity: apiItem.count,
      deadline: new Date(apiItem.expected_delivery_date),
      status: capitalize(apiItem.status) as RequestItem['status'],
      rawApiData: apiItem,
      supplierId: apiItem.supplier_id,
      productId: apiItem.product_id,
      receivedAt: apiItem.received_at ? new Date(apiItem.received_at) : null,
      warehouseId: apiItem.warehouse_id,
      unitPrice: apiItem.unit_price,
      quality: apiItem.quality,
      isDefective: apiItem.is_defective,
      supplierName: apiItem.supplier_name
    };
  }

  isOverdue(deadline: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate < today && !this.isToday(deadlineDate);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  }

  getRequestStatusClass(status: RequestItem['status']): string {
    switch (status) {
      case 'Pending': return 'bg-blue-100 text-blue-700';
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Received': return 'bg-purple-100 text-purple-700';
      case 'Returned': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  updateRequestStatus(requestId: number, newApiStatus: 'accepted' | 'rejected'): void {
    this.isLoading = true;
    // Construct the update URL using the base URL defined in the component
    const updateUrl = `${this.ORDER_MANAGEMENT_API_BASE_URL}/supplier-request/supplier/${this.supplierId}/${requestId}`;

    this.http.patch(updateUrl, { status: newApiStatus })
    .pipe(
      tap(() => {
        console.log(`Request ${requestId} status update to ${newApiStatus} successful.`);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`Error updating request ${requestId}:`, error);
        this.errorMessage = `Failed to update request ${requestId}. ${error.message || 'Please try again.'}`;
        this.isLoading = false;
        return throwError(() => error);
      }),
      switchMap(() => {
        this.loadRequests();
        return of(null);
      })
    )
    .subscribe({
        complete: () => {}
    });
  }

  acceptRequest(requestId: number): void {
    console.log(`Accepting request: ${requestId}`);
    this.updateRequestStatus(requestId, 'accepted');
  }

  rejectRequest(requestId: number): void {
    console.log(`Rejecting request: ${requestId}`);
    this.updateRequestStatus(requestId, 'rejected');
  }

  openDetailsModal(request: RequestItem): void {
    this.selectedRequestDetails = request;
    this.isModalOpen = true;
  }

  closeDetailsModal(): void {
    this.isModalOpen = false;
    this.selectedRequestDetails = null;
  }
}
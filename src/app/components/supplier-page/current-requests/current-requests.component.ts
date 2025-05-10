import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

// Interface for the data structure from your API
interface ApiRequestItem {
  request_id: number;
  supplier_id: number;
  created_at: string;
  expected_delivery_date: string;
  product_id: number;
  count: number;
  status: 'pending' | 'accepted' | 'rejected' | 'received' | 'returned';
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
  id: number;
  requestDate: Date;
  productName: string;
  quantity: number;
  deadline: Date;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Received' | 'Returned';
  receivedAt: Date | null; // Added for "Delivered Date"
  rawApiData?: ApiRequestItem;
  supplierId?: number;
  productId?: number;
  warehouseId?: number;
  unitPrice?: number | null;
  quality?: string | null;
  isDefective?: boolean | null;
  supplierName?: string;
}

interface JWTPayload {
  user_id: number;
  username: string;
  role_id: number;
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
  // Master list from API
  // allRequests: RequestItem[] = []; // We can derive filtered lists directly

  // Filtered lists for tables
  activeRequests: RequestItem[] = [];
  otherRequests: RequestItem[] = []; // For Rejected, Returned, Received

  // Counts for summary cards
  pendingCount: number = 0;
  acceptedCount: number = 0;
  receivedCount: number = 0; // For 'Received' status orders

  isLoading: boolean = false;
  errorMessage: string | null = null;
  selectedRequestDetails: RequestItem | null = null;
  isModalOpen: boolean = false;

  private supplierId!: number; // Will be set in ngOnInit

  private readonly ORDER_MANAGEMENT_API_BASE_URL = 'http://localhost:8000/api/v0/supplier-request';

  constructor(private http: HttpClient, public datePipe: DatePipe) {}

  ngOnInit(): void {
    let decoded: JWTPayload | null = null;
    const token = localStorage.getItem("token");
    if (token) {
      try {
        decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        this.supplierId = decoded?.user_id || 1; // Set supplierId here
      } catch (error) {
        console.error('Error decoding token:', error);
        this.supplierId = 1; // Fallback supplierId
      }
    } else {
      this.supplierId = 1; // Fallback if no token
      console.warn('No token found, using fallback supplierId.');
    }
    this.loadRequests(); // No need to pass supplierId if it's a class member
  }

  loadRequests(): void {
    this.isLoading = true;
    this.errorMessage = null;
    // Reset lists and counts
    this.activeRequests = [];
    this.otherRequests = [];
    this.pendingCount = 0;
    this.acceptedCount = 0;
    this.receivedCount = 0;

    if (!this.supplierId) {
        this.errorMessage = "Supplier ID not available. Cannot load requests.";
        this.isLoading = false;
        return;
    }

    this.http.get<ApiRequestItem[]>(`${this.ORDER_MANAGEMENT_API_BASE_URL}/supplier/${this.supplierId}/`).pipe(
      map(apiDataArray => {
        // First, transform all API items
        return apiDataArray.map(apiItem => this.transformApiItemToRequestItem(apiItem));
      }),
      tap(transformedRequests => {
        // Second, categorize and count
        this.processAndCategorizeRequests(transformedRequests);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching requests:', error);
        this.errorMessage = `Failed to load requests: ${error.statusText || 'Unknown error'}`;
        return of([]); // Return empty on error so tap doesn't break if array is expected
      })
    ).subscribe({
      // Data processing is now in 'tap', 'next' can be minimal or for final checks
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        // Error is caught by catchError, this ensures isLoading is false
        this.isLoading = false;
      }
    });
  }

  private processAndCategorizeRequests(requests: RequestItem[]): void {
    this.activeRequests = [];
    this.otherRequests = [];
    this.pendingCount = 0;
    this.acceptedCount = 0;
    this.receivedCount = 0;

    requests.forEach(request => {
      if (request.status === 'Pending' || request.status === 'Accepted') {
        this.activeRequests.push(request);
      } else if (request.status === 'Rejected' || request.status === 'Returned' || request.status === 'Received') {
        this.otherRequests.push(request);
      }

      // Update counts
      if (request.status === 'Pending') this.pendingCount++;
      if (request.status === 'Accepted') this.acceptedCount++;
      if (request.status === 'Received') this.receivedCount++;
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
      receivedAt: apiItem.received_at ? new Date(apiItem.received_at) : null, // Map received_at
      rawApiData: apiItem,
      supplierId: apiItem.supplier_id,
      productId: apiItem.product_id,
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
    const updateUrl = `${this.ORDER_MANAGEMENT_API_BASE_URL}/${requestId}/status/`;

    this.http.patch(updateUrl, { status: newApiStatus })
    .pipe(
      tap(() => {
        console.log(`Request ${requestId} status update to ${newApiStatus} successful.`);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`Error updating request ${requestId}:`, error);
        this.errorMessage = `Failed to update request ${requestId}. ${error.message || 'Please try again.'}`;
        // Do not set isLoading false here if switchMap follows, let loadRequests handle it
        return throwError(() => error);
      }),
      switchMap(() => {
        this.loadRequests(); // Reload all requests, which will re-filter and update counts
        return of(null);
      })
    )
    .subscribe({
      error: () => {
        // If switchMap or loadRequests itself errors out and doesn't complete
        this.isLoading = false;
      },
      complete: () => {
        // isLoading is typically set to false at the end of loadRequests
      }
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
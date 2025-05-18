import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

import {
  CurrentRequestService,
  RequestItem,
} from '../../../service/supplier/current-request.service';

@Component({
  selector: 'app-current-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-requests.component.html',
  styleUrls: ['./current-requests.component.css'],
  providers: [DatePipe],
})
export class CurrentRequestsComponent implements OnInit {
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

  private supplierId!: number;

  constructor(
    private requestService: CurrentRequestService,
    public datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.supplierId = this.requestService.getSupplierId();
    this.loadRequests();
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
      this.errorMessage = 'Supplier ID not available. Cannot load requests.';
      this.isLoading = false;
      return;
    }

    this.requestService
      .getSupplierRequests(this.supplierId)
      .pipe(
        tap((transformedRequests) => {
          this.processAndCategorizeRequests(transformedRequests);
        }),
        catchError((error) => {
          this.errorMessage = `Failed to load requests: ${
            error.message || 'Unknown error'
          }`;
          return of([]);
        })
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  private processAndCategorizeRequests(requests: RequestItem[]): void {
    requests.forEach((request) => {
      if (request.status === 'Pending' || request.status === 'Accepted') {
        this.activeRequests.push(request);
      } else if (
        request.status === 'Rejected' ||
        request.status === 'Returned' ||
        request.status === 'Received'
      ) {
        this.otherRequests.push(request);
      }

      // Update counts
      if (request.status === 'Pending') this.pendingCount++;
      if (request.status === 'Accepted') this.acceptedCount++;
      if (request.status === 'Received') this.receivedCount++;
    });
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
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  getRequestStatusClass(status: RequestItem['status']): string {
    switch (status) {
      case 'Pending':
        return 'bg-blue-100 text-blue-700';
      case 'Accepted':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Received':
        return 'bg-purple-100 text-purple-700';
      case 'Returned':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  updateRequestStatus(
    requestId: number,
    newStatus: 'accepted' | 'rejected'
  ): void {
    this.isLoading = true;

    this.requestService
      .updateRequestStatus(requestId, newStatus)
      .pipe(
        tap(() => {
          console.log(
            `Request ${requestId} status update to ${newStatus} successful.`
          );
        }),
        catchError((error) => {
          this.errorMessage = `Failed to update request ${requestId}. ${
            error.message || 'Please try again.'
          }`;
          return throwError(() => error);
        }),
        switchMap(() => {
          this.loadRequests(); // Reload all requests
          return of(null);
        })
      )
      .subscribe({
        error: () => {
          this.isLoading = false;
        },
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

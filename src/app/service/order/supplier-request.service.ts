import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

export interface SupplierRequest {
  request_id: number;
  supplier_name: string;
  supplier_id: number; // Make this required, not optional
  created_at: string;
  expected_delivery_date: string;
  product_name: string;
  product_id: number; // Make this required, not optional
  count: number;
  status: string;
  received_at: string | null;
  warehouse_id: number;
  unit_price: number;
}

export interface SurveySubmission {
  requestId: number;
  status: string;
  surveyResponses: {
    question1: number;
    question2: boolean;
  };
  comments: string;
}

// Update the interface to match the API requirements
export interface DeliverySubmission {
  requestId: number;
  product_id: number;
  supplier_id: number;
  warehouse_id: number;
  quantity: number;
  status: string;
  is_defective: boolean;
  quality: number;
  comments: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupplierRequestService {
  private apiUrl = 'http://localhost:8000/api'; // Replace with your actual API URL

  // Fix the mock data declaration - make it a private property
  private mockData: SupplierRequest[] = [
    {
      request_id: 1,
      supplier_name: 'Supplier A',
      supplier_id: 101,
      created_at: '2025-05-01',
      expected_delivery_date: '2025-05-05',
      product_name: 'Product 1',
      product_id: 1,
      count: 1200.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 1,
      unit_price: 50.0,
    },
    {
      request_id: 2,
      supplier_name: 'Supplier B',
      supplier_id: 102,
      created_at: '2025-05-02',
      expected_delivery_date: '2025-05-06',
      product_name: 'Product 2',
      product_id: 2,
      count: 1250.0,
      status: 'received',
      received_at: '2025-05-06',
      warehouse_id: 1,
      unit_price: 49.0,
    },
    {
      request_id: 3,
      supplier_name: 'Supplier C',
      supplier_id: 103,
      created_at: '2025-05-03',
      expected_delivery_date: '2025-05-07',
      product_name: 'Product 3',
      product_id: 3,
      count: 1300.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 1,
      unit_price: 48.0,
    },
    {
      request_id: 4,
      supplier_name: 'Supplier D',
      supplier_id: 104,
      created_at: '2025-05-04',
      expected_delivery_date: '2025-05-08',
      product_name: 'Product 4',
      product_id: 4,
      count: 1350.0,
      status: 'received',
      received_at: '2025-05-08',
      warehouse_id: 1,
      unit_price: 47.0,
    },
    {
      request_id: 5,
      supplier_name: 'Supplier E',
      supplier_id: 105,
      created_at: '2025-05-05',
      expected_delivery_date: '2025-05-09',
      product_name: 'Product 5',
      product_id: 5,
      count: 1400.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 1,
      unit_price: 46.0,
    },
    {
      request_id: 6,
      supplier_name: 'Supplier F',
      supplier_id: 106,
      created_at: '2025-05-06',
      expected_delivery_date: '2025-05-10',
      product_name: 'Product 6',
      product_id: 6,
      count: 1450.0,
      status: 'received',
      received_at: '2025-05-10',
      warehouse_id: 1,
      unit_price: 45.0,
    },
    {
      request_id: 7,
      supplier_name: 'Supplier G',
      supplier_id: 107,
      created_at: '2025-05-07',
      expected_delivery_date: '2025-05-11',
      product_name: 'Product 7',
      product_id: 7,
      count: 1500.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 1,
      unit_price: 44.0,
    },
    {
      request_id: 8,
      supplier_name: 'Supplier H',
      supplier_id: 108,
      created_at: '2025-05-08',
      expected_delivery_date: '2025-05-12',
      product_name: 'Product 8',
      product_id: 8,
      count: 1550.0,
      status: 'received',
      received_at: '2025-05-12',
      warehouse_id: 1,
      unit_price: 43.0,
    },
    {
      request_id: 9,
      supplier_name: 'Supplier I',
      supplier_id: 109,
      created_at: '2025-05-09',
      expected_delivery_date: '2025-05-13',
      product_name: 'Product 9',
      product_id: 9,
      count: 1600.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 1,
      unit_price: 42.0,
    },
    {
      request_id: 10,
      supplier_name: 'Supplier J',
      supplier_id: 110,
      created_at: '2025-05-10',
      expected_delivery_date: '2025-05-14',
      product_name: 'Product 10',
      product_id: 10,
      count: 1650.0,
      status: 'received',
      received_at: '2025-05-14',
      warehouse_id: 1,
      unit_price: 41.0,
    },
    {
      request_id: 11,
      supplier_name: 'Supplier A',
      supplier_id: 101,
      created_at: '2025-05-01',
      expected_delivery_date: '2025-05-05',
      product_name: 'Product 1',
      product_id: 1,
      count: 1700.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 2,
      unit_price: 40.0,
    },
    {
      request_id: 12,
      supplier_name: 'Supplier B',
      supplier_id: 102,
      created_at: '2025-05-02',
      expected_delivery_date: '2025-05-06',
      product_name: 'Product 2',
      product_id: 2,
      count: 1750.0,
      status: 'received',
      received_at: '2025-05-06',
      warehouse_id: 2,
      unit_price: 39.0,
    },
    {
      request_id: 13,
      supplier_name: 'Supplier C',
      supplier_id: 103,
      created_at: '2025-05-03',
      expected_delivery_date: '2025-05-07',
      product_name: 'Product 3',
      product_id: 3,
      count: 1800.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 2,
      unit_price: 38.0,
    },
    {
      request_id: 14,
      supplier_name: 'Supplier D',
      supplier_id: 104,
      created_at: '2025-05-04',
      expected_delivery_date: '2025-05-08',
      product_name: 'Product 4',
      product_id: 4,
      count: 1850.0,
      status: 'received',
      received_at: '2025-05-08',
      warehouse_id: 2,
      unit_price: 37.0,
    },
    {
      request_id: 15,
      supplier_name: 'Supplier E',
      supplier_id: 105,
      created_at: '2025-05-05',
      expected_delivery_date: '2025-05-09',
      product_name: 'Product 5',
      product_id: 5,
      count: 1900.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 2,
      unit_price: 36.0,
    },
    {
      request_id: 16,
      supplier_name: 'Supplier F',
      supplier_id: 106,
      created_at: '2025-05-06',
      expected_delivery_date: '2025-05-10',
      product_name: 'Product 6',
      product_id: 6,
      count: 1950.0,
      status: 'received',
      received_at: '2025-05-10',
      warehouse_id: 2,
      unit_price: 35.0,
    },
    {
      request_id: 17,
      supplier_name: 'Supplier G',
      supplier_id: 107,
      created_at: '2025-05-07',
      expected_delivery_date: '2025-05-11',
      product_name: 'Product 7',
      product_id: 7,
      count: 2000.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 2,
      unit_price: 34.0,
    },
    {
      request_id: 18,
      supplier_name: 'Supplier H',
      supplier_id: 108,
      created_at: '2025-05-08',
      expected_delivery_date: '2025-05-12',
      product_name: 'Product 8',
      product_id: 8,
      count: 2050.0,
      status: 'received',
      received_at: '2025-05-12',
      warehouse_id: 2,
      unit_price: 33.0,
    },
    {
      request_id: 19,
      supplier_name: 'Supplier I',
      supplier_id: 109,
      created_at: '2025-05-09',
      expected_delivery_date: '2025-05-13',
      product_name: 'Product 9',
      product_id: 9,
      count: 2100.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 2,
      unit_price: 32.0,
    },
    {
      request_id: 20,
      supplier_name: 'Supplier J',
      supplier_id: 110,
      created_at: '2025-05-10',
      expected_delivery_date: '2025-05-14',
      product_name: 'Product 10',
      product_id: 10,
      count: 2150.0,
      status: 'received',
      received_at: '2025-05-14',
      warehouse_id: 2,
      unit_price: 31.0,
    },
    {
      request_id: 21,
      supplier_name: 'Supplier A',
      supplier_id: 101,
      created_at: '2025-05-01',
      expected_delivery_date: '2025-05-05',
      product_name: 'Product 1',
      product_id: 1,
      count: 2200.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 3,
      unit_price: 30.0,
    },
    {
      request_id: 22,
      supplier_name: 'Supplier B',
      supplier_id: 102,
      created_at: '2025-05-02',
      expected_delivery_date: '2025-05-06',
      product_name: 'Product 2',
      product_id: 2,
      count: 2250.0,
      status: 'received',
      received_at: '2025-05-06',
      warehouse_id: 3,
      unit_price: 29.0,
    },
    {
      request_id: 23,
      supplier_name: 'Supplier C',
      supplier_id: 103,
      created_at: '2025-05-03',
      expected_delivery_date: '2025-05-07',
      product_name: 'Product 3',
      product_id: 3,
      count: 2300.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 3,
      unit_price: 28.0,
    },
    {
      request_id: 24,
      supplier_name: 'Supplier D',
      supplier_id: 104,
      created_at: '2025-05-04',
      expected_delivery_date: '2025-05-08',
      product_name: 'Product 4',
      product_id: 4,
      count: 2350.0,
      status: 'received',
      received_at: '2025-05-08',
      warehouse_id: 3,
      unit_price: 27.0,
    },
    {
      request_id: 25,
      supplier_name: 'Supplier E',
      supplier_id: 105,
      created_at: '2025-05-05',
      expected_delivery_date: '2025-05-09',
      product_name: 'Product 5',
      product_id: 5,
      count: 2400.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 3,
      unit_price: 26.0,
    },
    {
      request_id: 26,
      supplier_name: 'Supplier F',
      supplier_id: 106,
      created_at: '2025-05-06',
      expected_delivery_date: '2025-05-10',
      product_name: 'Product 6',
      product_id: 6,
      count: 2450.0,
      status: 'received',
      received_at: '2025-05-10',
      warehouse_id: 3,
      unit_price: 25.0,
    },
    {
      request_id: 27,
      supplier_name: 'Supplier G',
      supplier_id: 107,
      created_at: '2025-05-07',
      expected_delivery_date: '2025-05-11',
      product_name: 'Product 7',
      product_id: 7,
      count: 2500.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 3,
      unit_price: 24.0,
    },
    {
      request_id: 28,
      supplier_name: 'Supplier H',
      supplier_id: 108,
      created_at: '2025-05-08',
      expected_delivery_date: '2025-05-12',
      product_name: 'Product 8',
      product_id: 8,
      count: 2550.0,
      status: 'received',
      received_at: '2025-05-12',
      warehouse_id: 3,
      unit_price: 23.0,
    },
    {
      request_id: 29,
      supplier_name: 'Supplier I',
      supplier_id: 109,
      created_at: '2025-05-09',
      expected_delivery_date: '2025-05-13',
      product_name: 'Product 9',
      product_id: 9,
      count: 2600.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 3,
      unit_price: 22.0,
    },
    {
      request_id: 30,
      supplier_name: 'Supplier J',
      supplier_id: 110,
      created_at: '2025-05-10',
      expected_delivery_date: '2025-05-14',
      product_name: 'Product 10',
      product_id: 10,
      count: 2650.0,
      status: 'received',
      received_at: '2025-05-14',
      warehouse_id: 3,
      unit_price: 21.0,
    },
  ];

  constructor(private http: HttpClient) {}

  // Get all requests
  getAllRequests(): Observable<SupplierRequest[]> {
    const token = localStorage.getItem('token');
    let warehouse_id = 1; // Default warehouse ID
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        warehouse_id = decodedToken?.warehouse_id;
      }catch (error) {
        console.error('Invalid token:', error);
        return of(this.mockData);
      }
    }
        
    return this.http.get<SupplierRequest[]>(`http://localhost:8000/api/v0/supplier-request/warehouse/${warehouse_id}/?status=accepted`)
      .pipe(
        map(requests => {
          // Map "accepted" status to "pending" for UI display
          return requests.map(req => ({
            ...req,
            status: req.status === 'accepted' ? 'pending' : req.status
          }));
        }),
        catchError((error) => {
          console.error('Error fetching supplier requests:', error);
          return of(this.mockData);
        })
      );
  }

  // Get requests by warehouse ID
  getRequestsByWarehouse(warehouseId: number): Observable<SupplierRequest[]> {
    return of(this.mockData.filter((req) => req.warehouse_id === warehouseId));
  }

  // Get requests by status and warehouse ID
  getRequestsByStatusAndWarehouse(
    status: string,
    warehouseId: number
  ): Observable<SupplierRequest[]> {
    return of(
      this.mockData.filter(
        (req) => req.warehouse_id === warehouseId && req.status === status
      )
    );
  }

  // Mark request as completed
  markAsCompleted(requestId: number): Observable<SupplierRequest> {
    const request = this.mockData.find((req) => req.request_id === requestId);

    if (request) {
      request.status = 'received';
      request.received_at = new Date().toISOString().split('T')[0];
    }

    return of(request as SupplierRequest);
  }

  // Add this method to the SupplierRequestService class
  submitSurvey(
    survey: SurveySubmission
  ): Observable<{ success: boolean; message: string }> {
    // In a real app, this would send data to your backend API
    console.log('Survey submitted:', survey);

    // Update the local mock data to reflect status change
    const request = this.mockData.find(
      (req) => req.request_id === survey.requestId
    );
    if (request) {
      request.status = survey.status;
      if (survey.status === 'received') {
        request.received_at = new Date().toISOString().split('T')[0];
      }
    }

    // Return a mock successful response
    return of({
      success: true,
      message: `Order #${survey.requestId} has been updated to ${survey.status}`,
    });
  }

  // Add this method to make the real API call
  markDeliveryReceived(
    data: DeliverySubmission
  ): Observable<{ success: boolean; message: string }> {
    console.log('Sending data to API:', data);

    // Convert boolean to string for is_defective as required by API
    const apiPayload = {
      ...data,
      is_defective: data.is_defective.toString().toLowerCase(),
    };

    console.log('API Payload:', apiPayload);

    return this.http
      .post<{ success: boolean; message: string }>(
        `${this.apiUrl}/warehouse/mark-delivery-received/`,
        apiPayload
      )
      .pipe(
        catchError((error) => {
          console.error('Error submitting delivery status:', error);

          // Update mock data to reflect the change
          this.updateMockData(data);

          return of({
            success: false,
            message: error.error?.message || 'Failed to update delivery status',
          });
        })
      );
  }

  // Helper method to update mock data when API call fails
  private updateMockData(data: DeliverySubmission): void {
    const request = this.mockData.find(
      (req) => req.request_id === data.requestId
    );
    if (request) {
      request.status = data.status;
      if (data.status === 'received') {
        request.received_at = new Date().toISOString().split('T')[0];
      }
    }
  }

  // Other existing methods remain unchanged
}

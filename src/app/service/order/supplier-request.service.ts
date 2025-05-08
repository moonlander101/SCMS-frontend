import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SupplierRequest {
  request_id: number;
  supplier_name: string;
  created_at: string;
  expected_delivery_date: string;
  product_name: string;
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
    question2: number;
    question3: number;
    question4: number;
    question5: number;
  };
  comments: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupplierRequestService {
  private mockData: SupplierRequest[] = [
    {
      request_id: 1,
      supplier_name: 'Supplier A',
      created_at: '2025-05-01',
      expected_delivery_date: '2025-05-05',
      product_name: 'Product 1',
      count: 1200.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 1,
      unit_price: 50.0,
    },
    {
      request_id: 2,
      supplier_name: 'Supplier B',
      created_at: '2025-05-02',
      expected_delivery_date: '2025-05-06',
      product_name: 'Product 2',
      count: 1300.0,
      status: 'received',
      received_at: '2025-05-06',
      warehouse_id: 1,
      unit_price: 45.0,
    },
    {
      request_id: 3,
      supplier_name: 'Supplier C',
      created_at: '2025-05-03',
      expected_delivery_date: '2025-05-07',
      product_name: 'Product 3',
      count: 1400.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 1,
      unit_price: 40.0,
    },
    {
      request_id: 4,
      supplier_name: 'Supplier D',
      created_at: '2025-05-04',
      expected_delivery_date: '2025-05-08',
      product_name: 'Product 4',
      count: 1500.0,
      status: 'received',
      received_at: '2025-05-08',
      warehouse_id: 1,
      unit_price: 35.0,
    },
    {
      request_id: 5,
      supplier_name: 'Supplier E',
      created_at: '2025-05-05',
      expected_delivery_date: '2025-05-09',
      product_name: 'Product 5',
      count: 1600.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 1,
      unit_price: 30.0,
    },
    {
      request_id: 6,
      supplier_name: 'Supplier F',
      created_at: '2025-05-06',
      expected_delivery_date: '2025-05-10',
      product_name: 'Product 6',
      count: 1700.0,
      status: 'received',
      received_at: '2025-05-10',
      warehouse_id: 1,
      unit_price: 25.0,
    },
    {
      request_id: 7,
      supplier_name: 'Supplier G',
      created_at: '2025-05-07',
      expected_delivery_date: '2025-05-11',
      product_name: 'Product 7',
      count: 1800.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 1,
      unit_price: 20.0,
    },
    {
      request_id: 8,
      supplier_name: 'Supplier H',
      created_at: '2025-05-08',
      expected_delivery_date: '2025-05-12',
      product_name: 'Product 8',
      count: 1900.0,
      status: 'received',
      received_at: '2025-05-12',
      warehouse_id: 1,
      unit_price: 15.0,
    },
    {
      request_id: 9,
      supplier_name: 'Supplier I',
      created_at: '2025-05-09',
      expected_delivery_date: '2025-05-13',
      product_name: 'Product 9',
      count: 2000.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 1,
      unit_price: 10.0,
    },
    {
      request_id: 10,
      supplier_name: 'Supplier J',
      created_at: '2025-05-10',
      expected_delivery_date: '2025-05-14',
      product_name: 'Product 10',
      count: 2100.0,
      status: 'received',
      received_at: '2025-05-14',
      warehouse_id: 1,
      unit_price: 5.0,
    },
    {
      request_id: 11,
      supplier_name: 'Supplier A',
      created_at: '2025-05-01',
      expected_delivery_date: '2025-05-05',
      product_name: 'Product 1',
      count: 1250.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 2,
      unit_price: 51.0,
    },
    {
      request_id: 12,
      supplier_name: 'Supplier B',
      created_at: '2025-05-02',
      expected_delivery_date: '2025-05-06',
      product_name: 'Product 2',
      count: 1350.0,
      status: 'received',
      received_at: '2025-05-06',
      warehouse_id: 2,
      unit_price: 46.0,
    },
    {
      request_id: 13,
      supplier_name: 'Supplier C',
      created_at: '2025-05-03',
      expected_delivery_date: '2025-05-07',
      product_name: 'Product 3',
      count: 1450.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 2,
      unit_price: 41.0,
    },
    {
      request_id: 14,
      supplier_name: 'Supplier D',
      created_at: '2025-05-04',
      expected_delivery_date: '2025-05-08',
      product_name: 'Product 4',
      count: 1550.0,
      status: 'received',
      received_at: '2025-05-08',
      warehouse_id: 2,
      unit_price: 36.0,
    },
    {
      request_id: 15,
      supplier_name: 'Supplier E',
      created_at: '2025-05-05',
      expected_delivery_date: '2025-05-09',
      product_name: 'Product 5',
      count: 1650.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 2,
      unit_price: 31.0,
    },
    {
      request_id: 16,
      supplier_name: 'Supplier F',
      created_at: '2025-05-06',
      expected_delivery_date: '2025-05-10',
      product_name: 'Product 6',
      count: 1750.0,
      status: 'received',
      received_at: '2025-05-10',
      warehouse_id: 2,
      unit_price: 26.0,
    },
    {
      request_id: 17,
      supplier_name: 'Supplier G',
      created_at: '2025-05-07',
      expected_delivery_date: '2025-05-11',
      product_name: 'Product 7',
      count: 1850.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 2,
      unit_price: 21.0,
    },
    {
      request_id: 18,
      supplier_name: 'Supplier H',
      created_at: '2025-05-08',
      expected_delivery_date: '2025-05-12',
      product_name: 'Product 8',
      count: 1950.0,
      status: 'received',
      received_at: '2025-05-12',
      warehouse_id: 2,
      unit_price: 16.0,
    },
    {
      request_id: 19,
      supplier_name: 'Supplier I',
      created_at: '2025-05-09',
      expected_delivery_date: '2025-05-13',
      product_name: 'Product 9',
      count: 2050.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 2,
      unit_price: 11.0,
    },
    {
      request_id: 20,
      supplier_name: 'Supplier J',
      created_at: '2025-05-10',
      expected_delivery_date: '2025-05-14',
      product_name: 'Product 10',
      count: 2150.0,
      status: 'received',
      received_at: '2025-05-14',
      warehouse_id: 2,
      unit_price: 6.0,
    },
    {
      request_id: 21,
      supplier_name: 'Supplier A',
      created_at: '2025-05-01',
      expected_delivery_date: '2025-05-05',
      product_name: 'Product 1',
      count: 1220.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 3,
      unit_price: 52.0,
    },
    {
      request_id: 22,
      supplier_name: 'Supplier B',
      created_at: '2025-05-02',
      expected_delivery_date: '2025-05-06',
      product_name: 'Product 2',
      count: 1320.0,
      status: 'received',
      received_at: '2025-05-06',
      warehouse_id: 3,
      unit_price: 47.0,
    },
    {
      request_id: 23,
      supplier_name: 'Supplier C',
      created_at: '2025-05-03',
      expected_delivery_date: '2025-05-07',
      product_name: 'Product 3',
      count: 1420.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 3,
      unit_price: 42.0,
    },
    {
      request_id: 24,
      supplier_name: 'Supplier D',
      created_at: '2025-05-04',
      expected_delivery_date: '2025-05-08',
      product_name: 'Product 4',
      count: 1520.0,
      status: 'received',
      received_at: '2025-05-08',
      warehouse_id: 3,
      unit_price: 37.0,
    },
    {
      request_id: 25,
      supplier_name: 'Supplier E',
      created_at: '2025-05-05',
      expected_delivery_date: '2025-05-09',
      product_name: 'Product 5',
      count: 1620.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 3,
      unit_price: 32.0,
    },
    {
      request_id: 26,
      supplier_name: 'Supplier F',
      created_at: '2025-05-06',
      expected_delivery_date: '2025-05-10',
      product_name: 'Product 6',
      count: 1720.0,
      status: 'received',
      received_at: '2025-05-10',
      warehouse_id: 3,
      unit_price: 27.0,
    },
    {
      request_id: 27,
      supplier_name: 'Supplier G',
      created_at: '2025-05-07',
      expected_delivery_date: '2025-05-11',
      product_name: 'Product 7',
      count: 1820.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 3,
      unit_price: 22.0,
    },
    {
      request_id: 28,
      supplier_name: 'Supplier H',
      created_at: '2025-05-08',
      expected_delivery_date: '2025-05-12',
      product_name: 'Product 8',
      count: 1920.0,
      status: 'received',
      received_at: '2025-05-12',
      warehouse_id: 3,
      unit_price: 17.0,
    },
    {
      request_id: 29,
      supplier_name: 'Supplier I',
      created_at: '2025-05-09',
      expected_delivery_date: '2025-05-13',
      product_name: 'Product 9',
      count: 2020.0,
      status: 'pending',
      received_at: null,
      warehouse_id: 3,
      unit_price: 12.0,
    },
    {
      request_id: 30,
      supplier_name: 'Supplier J',
      created_at: '2025-05-10',
      expected_delivery_date: '2025-05-14',
      product_name: 'Product 10',
      count: 2120.0,
      status: 'received',
      received_at: '2025-05-14',
      warehouse_id: 3,
      unit_price: 7.0,
    },
  ];

  constructor() {}

  // Get all requests
  getAllRequests(): Observable<SupplierRequest[]> {
    return of(this.mockData);
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
}

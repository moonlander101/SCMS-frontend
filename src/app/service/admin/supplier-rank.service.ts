import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface SupplierRanking {
  supplier_id: number;
  company_name: string;
  score: number;
  state: string;
  best_action: string;
  q_value: number;
  city: string;
}

export interface SupplierRankingsResponse {
  product_id: string;
  city: string | null;
  suppliers: SupplierRanking[];
  count: number;
}

export interface SupplierAssignmentRequest {
  supplier_id: number;
  created_at: string;
  expected_delivery_date: string;
  product_id: number;
  count: number;
  status: string;
  warehouse_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class SupplierRankService {
  private apiUrl = 'http://localhost:8000/api/ranking/ranking/suppliers/';
  private assignmentUrl = 'http://localhost:8000/api/supplier/assign/';

  // Mock data for supplier rankings
  private mockRankings: SupplierRankingsResponse = {
    product_id: '1',
    city: null,
    suppliers: [
      {
        supplier_id: 12,
        company_name: 'Mu Logistics',
        score: 5.5524000000000004,
        state: 'Q4_D3_P3_S4',
        best_action: 'promote',
        q_value: 35.696621787482904,
        city: 'Jaffna',
      },
      {
        supplier_id: 8,
        company_name: 'Theta Products',
        score: 5.350200000000002,
        state: 'Q4_D3_P3_S4',
        best_action: 'promote',
        q_value: 35.696621787482904,
        city: 'Colombo',
      },
      {
        supplier_id: 1,
        company_name: 'Alpha Supplies Ltd',
        score: 5.332200000000001,
        state: 'Q4_D3_P3_S4',
        best_action: 'promote',
        q_value: 35.696621787482904,
        city: 'Jaffna',
      },
    ],
    count: 3,
  };

  constructor(private http: HttpClient) {}

  getSupplierRankings(productId: number): Observable<SupplierRankingsResponse> {
    // For development, return mock data
    return of(this.mockRankings);

    // For production, uncomment this line:
    // return this.http.get<SupplierRankingsResponse>(`${this.apiUrl}?product_id=${productId}`).pipe(
    //   catchError(this.handleError<SupplierRankingsResponse>('getSupplierRankings', { product_id: productId.toString(), city: null, suppliers: [], count: 0 }))
    // );
  }

  assignSupplier(request: SupplierAssignmentRequest): Observable<any> {
    // For development, just log and return success
    console.log('Assignment request:', request);
    return of({ success: true, message: 'Supplier assigned successfully' });

    // For production, uncomment this line:
    // return this.http.post<any>(this.assignmentUrl, request).pipe(
    //   catchError(this.handleError<any>('assignSupplier'))
    // );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

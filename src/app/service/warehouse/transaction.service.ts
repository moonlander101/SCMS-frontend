import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Transaction {
  id: number;
  transaction_type: string;
  quantity_change: string;
  reference_number: string;
  notes: string;
  created_at: string;
  created_by: string;
  inventory: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getWarehouseTransactions(warehouseId: number): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(
        `${this.apiUrl}/warehouse/transactions/warehouse/${warehouseId}/`
      )
      .pipe(
        catchError(
          this.handleError<Transaction[]>(
            'getWarehouseTransactions',
            this.getMockTransactions()
          )
        )
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // Mock data for testing
  getMockTransactions(): Transaction[] {
    return [
      {
        id: 1,
        transaction_type: 'INCOMING',
        quantity_change: '24700.18',
        reference_number: 'REF-4379',
        notes: 'Initial delivery',
        created_at: '2025-05-08T22:55:36.578017Z',
        created_by: 'Supplier 103',
        inventory: 1,
      },
      {
        id: 5,
        transaction_type: 'INCOMING',
        quantity_change: '10733.27',
        reference_number: 'REF-1839',
        notes: 'Initial delivery',
        created_at: '2025-05-08T22:55:41.172870Z',
        created_by: 'Supplier 103',
        inventory: 3,
      },
      {
        id: 6,
        transaction_type: 'OUTGOING',
        quantity_change: '10247.47',
        reference_number: 'OUT-6668',
        notes: 'Customer shipment',
        created_at: '2025-05-08T22:55:41.502824Z',
        created_by: 'System',
        inventory: 3,
      },
      // Add more mock transactions as needed
    ];
  }
}

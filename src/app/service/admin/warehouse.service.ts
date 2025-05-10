import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Warehouse {
  id: number;
  location_x: string;
  location_y: string;
  warehouse_name: string;
  capacity: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private apiUrl = 'http://localhost:8000/api/warehouse/warehouses/';

  // Mock data for warehouses
  private mockWarehouses: Warehouse[] = [
    {
      id: 1,
      location_x: '6.9271° N',
      location_y: '79.8612° E',
      warehouse_name: 'Colombo Central',
      capacity: '100000000.00',
      created_at: '2025-05-08T22:55:34.315909Z',
    },
    {
      id: 2,
      location_x: '7.2906° N',
      location_y: '80.6337° E',
      warehouse_name: 'Kandy Depot',
      capacity: '100000000.00',
      created_at: '2025-05-08T22:55:34.607587Z',
    },
    {
      id: 3,
      location_x: '7.0032° N',
      location_y: '80.1102° E',
      warehouse_name: 'Kurunegala Rock',
      capacity: '100000000.00',
      created_at: '2025-05-08T22:55:34.915771Z',
    },
  ];

  constructor(private http: HttpClient) {}

  getWarehouses(): Observable<Warehouse[]> {
    // For development, return mock data
    return of(this.mockWarehouses);

    // For production, uncomment this line:
    // return this.http.get<Warehouse[]>(this.apiUrl).pipe(
    //   catchError(this.handleError<Warehouse[]>('getWarehouses', []))
    // );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

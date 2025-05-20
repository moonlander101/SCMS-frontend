import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface TruckAddRequest {
  vehicle_id: string;
  model: string;
  capacity: number;
  status: string;
  fuel_type: string;
  plate_number: string;
  year_of_manufacture: number;
  depot_id: string;
  depot_latitude: string;
  depot_longitude: string;
  current_latitude: string;
  current_longitude: string;
  max_speed: number;
  fuel_efficiency: string;
  driver_assigned: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TruckAddService {
  private apiUrl = 'http://localhost:8006/api/v1/fleet/vehicles/';

  constructor(private http: HttpClient) {}

  addTruck(truckData: TruckAddRequest): Observable<any> {
    return this.http.post(this.apiUrl, truckData);
  }

  getWarehouseIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded token warehouse_id:', decoded.warehouse_id);
      return decoded.warehouse_id || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

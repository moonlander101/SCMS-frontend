import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DriverRegistration {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  vehicle_id: string;
  license_number: string;
  vehicle_type: string;
  role_id: number;
}

export interface WarehouseManagerRegistration {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  warehouse_id: string;
  department: string;
  phone: string;
  role_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost:8000/api/v1/register/';

  constructor(private http: HttpClient) {}

  registerDriver(data: DriverRegistration): Observable<any> {
    console.log('Registering driver:', data); // Debugging line
    return this.http.post(this.apiUrl, data);
  }

  registerWarehouseManager(
    data: WarehouseManagerRegistration
  ): Observable<any> {
    console.log('Registering warehouse manager:', data); // Debugging line
    return this.http.post(this.apiUrl, data);
  }
}

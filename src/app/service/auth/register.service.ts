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

export interface Vehicle {
  vehicle_id: string;
  plate_number: string;
  model: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost:8003/api/v1/register/';

  constructor(private http: HttpClient) {}

  registerWarehouseManager(
    data: WarehouseManagerRegistration
  ): Observable<any> {
    console.log('Registering warehouse manager:', data); // Debugging line
    return this.http.post(this.apiUrl, data);
  }

  getAvailableVehicles(): Observable<{ vehicles: Vehicle[] }> {
    return this.http.get<{ vehicles: Vehicle[] }>(
      'http://localhost:8002/api/fleet/vehicles/?driver_assigned=false'
    );
  }

  /**
   * Updates a vehicle's driver assignment status
   * @param driverData The driver registration data
   * @returns Observable of the API response
   */
  assignDriverToVehicle(driverData: DriverRegistration): Observable<any> {
    const vehicleId = driverData.vehicle_id;
    const url = `http://localhost:8002/api/fleet/vehicles/${vehicleId}/driver_assigned/`;

    console.log(`Assigning driver to vehicle ${vehicleId}:`, driverData);

    return this.http.patch(url, driverData);
  }
}

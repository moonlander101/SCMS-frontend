import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

export interface Driver {
  user_id: number;
  username: string;
  vehicle_id: string;
  vehicle_type: string;
  license_number: string;
}

export interface Vehicle {
  vehicle_id: string;
  plate_number: string;
  model: string;
  status: string;
}

export interface VehicleDetails {
  id: number;
  vehicle_id: string;
  model: string;
  status: string;
  plate_number: string;
  is_available: boolean;
  driver_assigned: boolean;
  // ...other properties
}

@Injectable({
  providedIn: 'root',
})
export class TruckAssignService {
  private driversUrl = 'http://localhost:8003/api/v1/drivers/';
  private vehiclesUrl = 'http://localhost:8002/api/fleet/vehicles/';

  constructor(private http: HttpClient) {}

  // Get available drivers
  getAvailableDrivers(): Observable<Driver[]> {
    return this.http
      .get<{ success: boolean; drivers: Driver[] }>(this.driversUrl)
      .pipe(map((response) => response.drivers));
  }

  // Get available vehicles
  getAvailableVehicles(): Observable<Vehicle[]> {
    return this.http
      .get<{ vehicles: Vehicle[] }>(this.vehiclesUrl + '?status=available&driver_assigned=false')
      .pipe(map((response) => response.vehicles));
  }

  // Get vehicle details
  getVehicleDetails(vehicleId: string): Observable<VehicleDetails> {
    return this.http.get<VehicleDetails>(`${this.vehiclesUrl}${vehicleId}/`);
  }

  // Get current vehicle status for a driver
  getCurrentVehicleStatus(vehicleId: string): Observable<string> {
    if (!vehicleId) {
      // If no vehicle assigned, return as available
      return of('available');
    }

    return this.getVehicleDetails(vehicleId).pipe(
      map((vehicleDetails) => vehicleDetails.status),
      catchError((error) => {
        console.error('Error getting vehicle status:', error);
        return of('unknown');
      })
    );
  }

  // Update vehicle driver assignment status with PATCH
  updateVehicleDriverStatus(
    vehicleId: string,
    isAssigned: boolean,
    driverInfo?: any
  ): Observable<any> {
    const payload = isAssigned
      ? { driver_assigned: true, ...driverInfo }
      : { driver_assigned: false };

    return this.http.patch(`${this.vehiclesUrl}${vehicleId}/`, payload);
  }

  // Handle complete driver reassignment process
  assignDriverToVehicle(driver: Driver, newVehicle: Vehicle): Observable<any> {
    // First, check if driver already has a vehicle assigned
    if (driver.vehicle_id && driver.vehicle_id !== newVehicle.vehicle_id) {
      // If yes, unassign the current vehicle first
      return this.updateVehicleDriverStatus(driver.vehicle_id, false).pipe(
        switchMap(() => {
          // Then assign the new vehicle
          return this.updateVehicleDriverStatus(newVehicle.vehicle_id, true, {
            username: driver.username,
            user_id: driver.user_id,
            license_number: driver.license_number,
          });
        }),
        // Also update the driver's record in the driver service
        switchMap(() => {
          const driverUpdate = {
            user_id: driver.user_id,
            vehicle_id: newVehicle.vehicle_id,
            vehicle_type: newVehicle.model,
          };
          return this.http.put(
            `${this.driversUrl}vehicle/update/`,
            driverUpdate
          );
        })
      );
    } else {
      // If driver has no vehicle, simply assign the new one
      return this.updateVehicleDriverStatus(newVehicle.vehicle_id, true, {
        username: driver.username,
        user_id: driver.user_id,
        license_number: driver.license_number,
      }).pipe(
        // Also update the driver's record in the driver service
        switchMap(() => {
          const driverUpdate = {
            user_id: driver.user_id,
            vehicle_id: newVehicle.vehicle_id,
            vehicle_type: newVehicle.model,
          };
          return this.http.put(
            `${this.driversUrl}vehicle/update/`,
            driverUpdate
          );
        })
      );
    }
  }
}

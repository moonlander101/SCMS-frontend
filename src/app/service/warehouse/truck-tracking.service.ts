import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TruckSummary {
  truck_id: string;
  plate_number: string;
  model: string;
  is_active: boolean; // derived from status
  status: string; // from API: "available", "maintenance", "assigned"
}

export interface Location {
  latitude: number;
  longitude: number;
  location_name: string;
  timestamp: string;
}

export interface Driver {
  driver_id: string;
  name: string;
  contact_number: string;
  license_number: string;
}

export interface TruckDetails {
  plate_number: string;
  truck_id: string;
  model: string;
  status: string; // String status like "available", "maintenance", etc.
  locationData: {
    // This property contains the location data instead of status
    current_location: Location;
    location_history: Location[];
  };
  driver?: Driver;
}

@Injectable({
  providedIn: 'root',
})
export class TruckTrackingService {
  private apiUrl = 'http://localhost:8002/api/fleet/vehicles';

  constructor(private http: HttpClient) {}

  getTrucks(): Observable<TruckSummary[]> {
    return this.http.get<{ vehicles: any[] }>(this.apiUrl).pipe(
      map((response) => {
        // Transform the API response to match our TruckSummary interface
        return response.vehicles.map((vehicle) => ({
          truck_id: vehicle.vehicle_id,
          plate_number: vehicle.plate_number || 'No Plate',
          model: vehicle.model,
          status: vehicle.status,
          is_active:
            vehicle.status === 'available' || vehicle.status === 'assigned',
        }));
      })
    );
  }

  getTruckDetails(truckId: string): Observable<TruckDetails> {
    return this.http
      .get<any>(`${this.apiUrl}/${truckId}/location_overview/`)
      .pipe(
        map((response) => {
          // Transform latitude/longitude from string to number if needed
          const currentLocation = {
            ...response.status.current_location,
            latitude: parseFloat(response.status.current_location.latitude),
            longitude: parseFloat(response.status.current_location.longitude),
          };

          const locationHistory = response.status.location_history.map(
            (loc: any) => ({
              ...loc,
              latitude: parseFloat(loc.latitude),
              longitude: parseFloat(loc.longitude),
            })
          );

          // Return the formatted truck details with the correct structure
          return {
            truck_id: response.truck_id,
            plate_number: response.plate_number || 'No Plate',
            model: response.model,
            status: response.status || 'unknown', // Status as a string value
            locationData: {
              // Properly separate location data
              current_location: currentLocation,
              location_history: locationHistory,
            },
            driver: {
              driver_id: 'N/A',
              name: 'Driver information not available',
              contact_number: 'N/A',
              license_number: 'N/A',
            },
          };
        })
      );
  }
}

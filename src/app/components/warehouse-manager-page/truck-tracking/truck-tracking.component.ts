import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  TruckTrackingService,
  TruckSummary,
  TruckDetails,
} from '../../../service/warehouse/truck-tracking.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-truck-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './truck-tracking.component.html',
  styleUrl: './truck-tracking.component.css',
})
export class TruckTrackingComponent implements OnInit {
  trucks: TruckSummary[] = [];
  selectedTruck?: TruckDetails;
  isLoading = true;
  searchQuery = '';
  filterActive = true; // Default: show only active trucks
  error: string | null = null;

  // Add these properties to your component
  statusFilter = 'all';
  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'out_of_service', label: 'Out of Service' },
  ];

  constructor(private truckTrackingService: TruckTrackingService) {}

  ngOnInit(): void {
    this.loadTrucks();
  }

  loadTrucks(): void {
    this.isLoading = true;
    this.error = null;

    this.truckTrackingService.getTrucks().subscribe({
      next: (trucks) => {
        this.trucks = trucks;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trucks', error);
        this.error = 'Failed to load truck data. Please try again.';
        this.isLoading = false;
      },
    });
  }

  viewTruckDetails(truckId: string): void {
    if (!this.isActiveTruck(truckId)) return;

    this.isLoading = true;
    this.error = null;

    this.truckTrackingService.getTruckDetails(truckId).subscribe({
      next: (details) => {
        this.selectedTruck = details;
        this.isLoading = false;

        // In a real implementation, this is where we would initialize a map
        setTimeout(() => this.initMap(), 100);
      },
      error: (error) => {
        console.error('Error loading truck details', error);
        this.error = 'Failed to load truck details. Please try again.';
        this.isLoading = false;
      },
    });
  }

  backToList(): void {
    this.selectedTruck = undefined;
  }

  isActiveTruck(truckId: string): boolean {
    const truck = this.trucks.find((t) => t.truck_id === truckId);
    return truck?.is_active || false;
  }

  // Update the filteredTrucks getter to include status filtering
  get filteredTrucks(): TruckSummary[] {
    return this.trucks.filter((truck) => {
      // Apply active filter if enabled
      if (this.filterActive && !truck.is_active) {
        return false;
      }

      // Apply status filter if not set to 'all'
      if (this.statusFilter !== 'all' && truck.status !== this.statusFilter) {
        return false;
      }

      // Apply search query if any
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return (
          truck.plate_number.toLowerCase().includes(query) ||
          truck.truck_id.toLowerCase().includes(query) ||
          truck.model.toLowerCase().includes(query) ||
          truck.status.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getTimeDifference(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hr ago`;
    }
  }

  // In a real application, this would initialize an actual map
  // Update your initMap method to use locationData
  initMap(): void {
    console.log(
      'Map would be initialized here with coordinates:',
      this.selectedTruck?.locationData.current_location.latitude,
      this.selectedTruck?.locationData.current_location.longitude
    );
  }

    // In a real implementation, you would initialize a map library like Google Maps or Leaflet here
  }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  TruckAssignService,
  Driver,
  Vehicle,
} from '../../../service/admin/truck-assign.service';

@Component({
  selector: 'app-truck-assign',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './truck-assign.component.html',
  styleUrl: './truck-assign.component.css',
})
export class TruckAssignComponent implements OnInit {
  // Data sources
  availableDrivers: Driver[] = [];
  availableVehicles: Vehicle[] = [];

  // Loading states
  isLoadingDrivers = false;
  isLoadingVehicles = false;

  // Error states
  driversError: string | null = null;
  vehiclesError: string | null = null;

  // Selection states
  selectedDriver: Driver | null = null;
  selectedVehicle: Vehicle | null = null;
  customVehicleType: string = '';

  // Driver's current vehicle status
  currentVehicleStatus: string | null = null;
  isCheckingVehicle = false;

  // Assignment process
  isAssigning = false;
  assignmentStatus: { success: boolean; message: string } | null = null;

  constructor(private truckAssignService: TruckAssignService) {}

  ngOnInit(): void {
    this.loadDrivers();
    this.loadVehicles();
  }

  loadDrivers(): void {
    this.isLoadingDrivers = true;
    this.driversError = null;

    this.truckAssignService.getAvailableDrivers().subscribe({
      next: (drivers) => {
        this.availableDrivers = drivers;
        this.isLoadingDrivers = false;
      },
      error: (error) => {
        console.error('Error loading drivers:', error);
        this.driversError =
          'Failed to load available drivers. Please try again.';
        this.isLoadingDrivers = false;
      },
    });
  }

  loadVehicles(): void {
    this.isLoadingVehicles = true;
    this.vehiclesError = null;

    this.truckAssignService.getAvailableVehicles().subscribe({
      next: (vehicles) => {
        this.availableVehicles = vehicles;
        this.isLoadingVehicles = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.vehiclesError =
          'Failed to load available vehicles. Please try again.';
        this.isLoadingVehicles = false;
      },
    });
  }

  onDriverSelect(driver: Driver): void {
    this.selectedDriver = driver;
    this.assignmentStatus = null;

    // Check current vehicle status
    if (driver.vehicle_id) {
      this.isCheckingVehicle = true;
      this.currentVehicleStatus = null;

      this.truckAssignService
        .getCurrentVehicleStatus(driver.vehicle_id)
        .subscribe({
          next: (status) => {
            this.currentVehicleStatus = status;
            this.isCheckingVehicle = false;
          },
          error: (error) => {
            console.error('Error checking vehicle status:', error);
            this.currentVehicleStatus = 'unknown';
            this.isCheckingVehicle = false;
          },
        });
    } else {
      this.currentVehicleStatus = null;
    }
  }

  onVehicleSelect(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.assignmentStatus = null;

    // Auto-populate vehicle type from model
    this.customVehicleType = vehicle.model;
  }

  assignVehicle(): void {
    if (!this.selectedDriver || !this.selectedVehicle) {
      return;
    }

    this.isAssigning = true;
    this.assignmentStatus = null;

    // Check if this is a reassignment (driver already has a truck)
    const isReassignment =
      !!this.selectedDriver.vehicle_id &&
      this.selectedDriver.vehicle_id !== this.selectedVehicle.vehicle_id;

    this.truckAssignService
      .assignDriverToVehicle(this.selectedDriver, this.selectedVehicle)
      .subscribe({
        next: (response) => {
          let successMessage = `Successfully assigned ${this.selectedDriver?.username} to vehicle ${this.selectedVehicle?.vehicle_id}.`;

          if (isReassignment) {
            successMessage = `Successfully reassigned ${this.selectedDriver?.username} from vehicle ${this.selectedDriver?.vehicle_id} to ${this.selectedVehicle?.vehicle_id}.`;
          }

          this.assignmentStatus = {
            success: true,
            message: successMessage,
          };
          this.isAssigning = false;

          // Refresh data
          this.loadDrivers();
          this.loadVehicles();

          // Reset selection
          this.selectedDriver = null;
          this.selectedVehicle = null;
          this.customVehicleType = '';
          this.currentVehicleStatus = null;
        },
        error: (error) => {
          console.error('Error assigning vehicle:', error);
          this.assignmentStatus = {
            success: false,
            message:
              error.error?.message ||
              'Failed to assign vehicle. Please try again.',
          };
          this.isAssigning = false;
        },
      });
  }

  canAssign(): boolean {
    return (
      !!this.selectedDriver &&
      !!this.selectedVehicle &&
      !this.isAssigning &&
      (this.currentVehicleStatus === null ||
        this.currentVehicleStatus === 'available')
    );
  }

  resetForm(): void {
    this.selectedDriver = null;
    this.selectedVehicle = null;
    this.customVehicleType = '';
    this.currentVehicleStatus = null;
    this.assignmentStatus = null;
  }
}

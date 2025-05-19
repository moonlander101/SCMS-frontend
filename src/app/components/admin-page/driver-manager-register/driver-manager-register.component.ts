import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  RegisterService,
  Vehicle,
} from '../../../service/auth/register.service';
import { HttpClientModule } from '@angular/common/http';
import {
  WarehouseService,
  Warehouse,
} from '../../../service/warehouse/warehouse.service';

@Component({
  selector: 'app-driver-manager-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './driver-manager-register.component.html',
  styleUrl: './driver-manager-register.component.css',
})
export class DriverManagerRegisterComponent implements OnInit {
  driverForm!: FormGroup;
  warehouseManagerForm!: FormGroup;
  activeTab: 'driver' | 'warehouseManager' = 'driver';
  submitStatus: { success: boolean; message: string } | null = null;
  isSubmitting = false;

  // Vehicle properties
  vehicles: Vehicle[] = [];
  isLoadingVehicles = false;
  vehicleLoadError: string | null = null;

  // Warehouse properties
  warehouses: Warehouse[] = [];
  isLoadingWarehouses = false;
  warehouseLoadError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit() {
    this.initDriverForm();
    this.initWarehouseManagerForm();
    this.loadAvailableVehicles();
    this.loadWarehouses();
  }

  initDriverForm() {
    this.driverForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      vehicle_id: ['', Validators.required],
      license_number: ['', Validators.required],
      vehicle_type: ['lorry', Validators.required],
    });
  }

  initWarehouseManagerForm() {
    this.warehouseManagerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      warehouse_id: ['', Validators.required],
      department: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  setActiveTab(tab: 'driver' | 'warehouseManager') {
    this.activeTab = tab;
    this.submitStatus = null;
  }

  onDriverSubmit() {
    if (this.driverForm.invalid) {
      this.markFormGroupTouched(this.driverForm);
      return;
    }
    this.registerDriver();
  }

  onWarehouseManagerSubmit() {
    if (this.warehouseManagerForm.invalid) {
      this.markFormGroupTouched(this.warehouseManagerForm);
      return;
    }

    const warehouseManagerData = {
      ...this.warehouseManagerForm.value,
      role_id: 5, // Fixed role ID for warehouse managers
    };

    this.isSubmitting = true;
    this.registerService
      .registerWarehouseManager(warehouseManagerData)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitStatus = {
            success: true,
            message: 'Warehouse Manager registered successfully!',
          };
          this.warehouseManagerForm.reset();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submitStatus = {
            success: false,
            message:
              error.error?.message || 'Registration failed. Please try again.',
          };
        },
      });
  }

  // Add this method to fetch vehicles
  loadAvailableVehicles() {
    this.isLoadingVehicles = true;
    this.vehicleLoadError = null;

    this.registerService.getAvailableVehicles().subscribe({
      next: (response) => {
        this.vehicles = response.vehicles;
        this.isLoadingVehicles = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.vehicleLoadError =
          'Failed to load available vehicles. Please try again.';
        this.isLoadingVehicles = false;
      },
    });
  }

  // Add this method to load warehouses
  loadWarehouses() {
    this.isLoadingWarehouses = true;
    this.warehouseLoadError = null;

    this.warehouseService.getWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses;
        this.isLoadingWarehouses = false;
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
        this.warehouseLoadError =
          'Failed to load warehouses. Please try again.';
        this.isLoadingWarehouses = false;
      },
    });
  }

  // Add this method to handle vehicle selection
  onVehicleSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedVehicleId = selectElement.value;

    if (selectedVehicleId) {
      const selectedVehicle = this.vehicles.find(
        (v) => v.vehicle_id === selectedVehicleId
      );

      if (selectedVehicle) {
        const model = selectedVehicle.model.toLowerCase();

        // Set the vehicle type in the form
        this.driverForm.patchValue({
          vehicle_type: model,
        });
      }
    }
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  // Form validation helpers
  hasError(form: FormGroup, controlName: string, errorType: string): boolean {
    const control = form.get(controlName);
    return control !== null && control.touched && control.hasError(errorType);
  }

  registerDriver() {
    this.isSubmitting = true;
    this.submitStatus = null;

    const driverData = this.driverForm.value;
    driverData.role_id = 6; // Setting role_id for driver

    // Only make a single API call to assign driver to vehicle
    // This will handle both driver registration and vehicle assignment
    this.registerService.assignDriverToVehicle(driverData).subscribe({
      next: (response) => {
        console.log('Driver registered and vehicle assigned:', response);
        this.submitStatus = {
          success: true,
          message: 'Driver registered and vehicle assigned successfully!',
        };
        // Reset form after successful submission
        this.driverForm.reset();
        // Set default value for vehicle_type
        this.driverForm.patchValue({
          vehicle_type: 'lorry',
        });
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.submitStatus = {
          success: false,
          message:
            error.error?.message || 'Registration failed. Please try again.',
        };
        this.isSubmitting = false;
      },
    });
  }
}

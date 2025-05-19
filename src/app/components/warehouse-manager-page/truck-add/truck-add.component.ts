import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  TruckAddService,
  TruckAddRequest,
} from '../../../service/warehouse/truck-add.service';
import {
  WarehouseService,
  Warehouse,
} from '../../../service/admin/warehouse.service';

@Component({
  selector: 'app-truck-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './truck-add.component.html',
  styleUrl: './truck-add.component.css',
})
export class TruckAddComponent implements OnInit {
  truckForm!: FormGroup;
  isSubmitting = false;
  submitStatus: { success: boolean; message: string } | null = null;
  warehouse: Warehouse | null = null;
  isLoadingWarehouse = true;
  warehouseError: string | null = null;

  fuelTypes = [
    { value: 'diesel', label: 'Diesel' },
    { value: 'petrol', label: 'Petrol' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  yearOptions: number[] = [];

  constructor(
    private fb: FormBuilder,
    private truckAddService: TruckAddService,
    private warehouseService: WarehouseService
  ) {
    // Create year options from 1990 to current year
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1990; year--) {
      this.yearOptions.push(year);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.loadWarehouseData();
  }

  initForm(): void {
    this.truckForm = this.fb.group({
      vehicle_id: [
        '',
        [Validators.required, Validators.pattern('[A-Za-z0-9]{3,10}')],
      ],
      model: ['', [Validators.required]],
      capacity: [1000, [Validators.required, Validators.min(100)]],
      plate_number: ['', [Validators.required]],
      year_of_manufacture: [new Date().getFullYear(), [Validators.required]],
      max_speed: [
        120,
        [Validators.required, Validators.min(10), Validators.max(200)],
      ],
      fuel_efficiency: ['10', [Validators.required]],
      fuel_type: ['diesel', [Validators.required]],

      // These will be set from warehouse data
      depot_id: ['', [Validators.required]],
      depot_latitude: ['', [Validators.required]],
      depot_longitude: ['', [Validators.required]],

      // These will be defaulted to depot location initially
      current_latitude: ['', [Validators.required]],
      current_longitude: ['', [Validators.required]],
    });
  }

  loadWarehouseData(): void {
    const warehouseId = this.truckAddService.getWarehouseIdFromToken();

    if (!warehouseId) {
      this.warehouseError =
        'Warehouse ID not found in your authentication token. Please contact support.';
      this.isLoadingWarehouse = false;
      return;
    }

    this.warehouseService.getWarehouses().subscribe({
      next: (warehouses) => {
        const foundWarehouse = warehouses.find((w) => w.id == warehouseId);
        console.log('Found warehouse:', foundWarehouse);

        if (foundWarehouse) {
          this.warehouse = foundWarehouse;

          // Parse coordinates from "6.9271° N" format to numeric string
          const latValue = this.parseCoordinate(foundWarehouse.location_x);
          const lngValue = this.parseCoordinate(foundWarehouse.location_y);

          // Update form with warehouse data
          this.truckForm.patchValue({
            depot_id: foundWarehouse.id.toString(),
            depot_latitude: latValue,
            depot_longitude: lngValue,
            current_latitude: latValue, // Initially at depot
            current_longitude: lngValue, // Initially at depot
          });
        } else {
          this.warehouseError = `Warehouse with ID ${warehouseId} not found.`;
        }

        this.isLoadingWarehouse = false;
      },
      error: (error) => {
        console.error('Error loading warehouse data:', error);
        this.warehouseError =
          'Failed to load warehouse data. Please try again.';
        this.isLoadingWarehouse = false;
      },
    });
  }

  parseCoordinate(coordString: string): string {
    // Extract just the numeric part from e.g., "6.9271° N"
    const match = coordString.match(/(\d+\.\d+)/);
    return match ? match[1] : '0';
  }

  onSubmit(): void {
    if (this.truckForm.invalid) {
      this.markFormGroupTouched(this.truckForm);
      return;
    }

    this.isSubmitting = true;
    this.submitStatus = null;

    // Create the truck data object
    const truckData: TruckAddRequest = {
      ...this.truckForm.value,
      status: 'available', // Default status for new trucks
      driver_assigned: false, // No driver assigned initially
    };

    console.log('Submitting truck data:', truckData);

    this.truckAddService.addTruck(truckData).subscribe({
      next: (response) => {
        console.log('Truck added successfully:', response);
        this.submitStatus = {
          success: true,
          message: 'Truck has been added successfully!',
        };
        this.truckForm.reset();
        this.initForm(); // Reset form to default values
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error adding truck:', error);
        this.submitStatus = {
          success: false,
          message:
            error.error?.message || 'Failed to add truck. Please try again.',
        };
        this.isSubmitting = false;
      },
    });
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.truckForm.get(controlName);
    return control ? control.touched && control.hasError(errorName) : false;
  }
}

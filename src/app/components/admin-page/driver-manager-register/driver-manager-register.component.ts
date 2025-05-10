import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterService } from '../../../service/auth/register.service';
import { HttpClientModule } from '@angular/common/http';

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

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.initDriverForm();
    this.initWarehouseManagerForm();
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

    const driverData = {
      ...this.driverForm.value,
      role_id: 6, // Fixed role ID for drivers
    };

    this.isSubmitting = true;
    this.registerService.registerDriver(driverData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitStatus = {
          success: true,
          message: 'Driver registered successfully!',
        };
        this.driverForm.reset();
        // Reset the form with default values for dropdowns
        this.driverForm.patchValue({ vehicle_type: 'lorry' });
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
}

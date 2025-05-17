import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierSignupService } from '../../../service/auth/supplier-signup.service';

@Component({
  selector: 'app-supplier-signup',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './supplier-signup.component.html',
  styleUrl: './supplier-signup.component.css',
})
export class SupplierSignupComponent implements OnInit, AfterViewInit {
  signInForm: FormGroup;
  signUpForm: FormGroup;
  isSignUpMode = false;
  currentStep = 1;
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private supplierSignupService: SupplierSignupService
  ) {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signUpForm = this.fb.group({
      // Step 1: Personal Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],

      // Step 2: Company Details
      companyName: ['', Validators.required],
      businessType: ['', Validators.required],
      taxId: ['', Validators.required],
      streetNo: ['', Validators.required],
      streetName: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],

      // Step 3: Account Setup
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const container = document.querySelector('.auth-container');
      if (container) {
        container.classList.add('animate-in');
      }
    }, 0);
  }

  // Form step navigation
  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    // Validate fields for current step
    switch (this.currentStep) {
      case 1:
        return this.validateStep1();
      case 2:
        return this.validateStep2();
      default:
        return true;
    }
  }

  validateStep1(): boolean {
    const step1Fields = ['firstName', 'lastName', 'phone'];
    return this.validateFields(step1Fields);
  }

  validateStep2(): boolean {
    const step2Fields = [
      'companyName',
      'businessType',
      'taxId',
      'streetNo',
      'streetName',
      'city',
      'zipCode',
    ];
    return this.validateFields(step2Fields);
  }

  validateFields(fieldNames: string[]): boolean {
    let valid = true;

    fieldNames.forEach((field) => {
      const control = this.signUpForm.get(field);
      if (control?.invalid) {
        control.markAsTouched();
        valid = false;
      }
    });

    return valid;
  }

  toggleSignUpMode(): void {
    this.isSignUpMode = true;
    document.querySelector('.auth-container')?.classList.add('sign-up-mode');
  }

  toggleSignInMode(): void {
    this.isSignUpMode = false;
    document.querySelector('.auth-container')?.classList.remove('sign-up-mode');
  }

  onSignIn(): void {
    if (this.signInForm.valid) {
      console.log('Sign In Form submitted', this.signInForm.value);
      // Add authentication logic here
    }
  }

  onSignUp(): void {
    if (this.signUpForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      // Format payload to match exactly what backend expects
      const payload = {
        username: this.signUpForm.value.username,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
        first_name: this.signUpForm.value.firstName,
        last_name: this.signUpForm.value.lastName,
        company_name: this.signUpForm.value.companyName,
        street_no: this.signUpForm.value.streetNo,
        street_name: this.signUpForm.value.streetName,
        city: this.signUpForm.value.city,
        zipcode: this.signUpForm.value.zipCode,
        business_type: this.signUpForm.value.businessType,
        tax_id: this.signUpForm.value.taxId,
        phone: this.signUpForm.value.phone,
        role_id: 3,
      };

      console.log('Supplier Registration Payload:', payload);

      // Call the service to register the supplier
      this.supplierSignupService.registerSupplier(payload).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // Show success message or redirect
          this.router.navigate(['/dashboard/supplier']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.errorMessage =
            error.message || 'Registration failed. Please try again.';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signUpForm.controls).forEach((key) => {
        this.signUpForm.get(key)?.markAsTouched();
      });
    }
  }
}

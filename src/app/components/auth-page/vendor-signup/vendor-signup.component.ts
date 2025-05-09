import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorSignupService } from '../../../service/auth/vendor-signup.service'; // Import the service
import { LoginService } from '../../../service/auth/login.service'; // Import the LoginService
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-vendor-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [VendorSignupService, LoginService], // Provide both services
  templateUrl: './vendor-signup.component.html',
  styleUrl: './vendor-signup.component.css',
})
export class VendorSignupComponent implements OnInit, AfterViewInit {
  signInForm: FormGroup;
  signUpForm: FormGroup;
  isSignUpMode = false;
  currentStep = 1;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vendorService: VendorSignupService,
    private loginService: LoginService // Inject the LoginService
  ) {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.signUpForm = this.fb.group({
      // Step 1: Personal Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],

      // Step 2: Company Details
      companyName: ['', Validators.required],
      streetNo: ['', Validators.required],
      streetName: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      businessLicence: ['', Validators.required], // Add business licence field

      // Step 3: Account Setup
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
    const step1Fields = ['firstName', 'lastName', 'username'];
    return this.validateFields(step1Fields);
  }

  validateStep2(): boolean {
    const step2Fields = [
      'companyName',
      'streetNo',
      'streetName',
      'city',
      'zipCode',
      'businessLicence',
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
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = {
        username: this.signInForm.value.username,
        password: this.signInForm.value.password,
      };

      this.loginService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          // Navigation based on user role
          const user = this.loginService.getCurrentUser();
          if (user && user.role === 'Vendor') {
            this.router.navigate(['/dashboard/profile']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage =
            error.error?.message || 'Login failed. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  onSignUp(): void {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Construct full address
      const address = `${this.signUpForm.value.streetNo} ${this.signUpForm.value.streetName}, ${this.signUpForm.value.city}, ${this.signUpForm.value.zipCode}`;

      const payload = {
        username: this.signUpForm.value.username,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
        first_name: this.signUpForm.value.firstName,
        last_name: this.signUpForm.value.lastName,
        shop_name: this.signUpForm.value.companyName,
        location: address,
        business_licence: this.signUpForm.value.businessLicence,
      };

      console.log('Vendor Sign Up Payload:', payload);

      this.vendorService.registerVendor(payload).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // You might want to auto-login the user or just redirect
          this.router.navigate(['/dashboard/profile']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.errorMessage =
            error.error?.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
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

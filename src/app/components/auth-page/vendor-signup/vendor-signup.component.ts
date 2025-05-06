import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-vendor-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendor-signup.component.html',
  styleUrl: './vendor-signup.component.css'
})
export class VendorSignupComponent implements OnInit, AfterViewInit {
  signInForm: FormGroup;
  signUpForm: FormGroup;
  isSignUpMode = false;
  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private router: Router // Inject Router
  ) {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signUpForm = this.fb.group({
      // Step 1: Personal Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      phone: ['', Validators.required],
      
      // Step 2: Company Details
      companyName: ['', Validators.required],
      streetNo: ['', Validators.required],
      streetName: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      
      // Step 3: Account Setup
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
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
    switch(this.currentStep) {
      case 1:
        return this.validateStep1();
      case 2:
        return this.validateStep2();
      default:
        return true;
    }
  }

  validateStep1(): boolean {
    const step1Fields = ['firstName', 'lastName', 'username', 'phone'];
    return this.validateFields(step1Fields);
  }

  validateStep2(): boolean {
    const step2Fields = ['companyName', 'streetNo', 'streetName', 'city', 'zipCode'];
    return this.validateFields(step2Fields);
  }

  validateFields(fieldNames: string[]): boolean {
    let valid = true;
    
    fieldNames.forEach(field => {
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
      // Add navigation for sign in if needed
      // this.router.navigate(['/dashboard/vendor']);
    }
  }

  onSignUp(): void {
    if (this.signUpForm.valid) {
      // Construct full address
      const address = `${this.signUpForm.value.streetNo} ${this.signUpForm.value.streetName}, ${this.signUpForm.value.city}, ${this.signUpForm.value.zipCode}`;
      
      const payload = {
        firstName: this.signUpForm.value.firstName,
        lastName: this.signUpForm.value.lastName,
        username: this.signUpForm.value.username,
        phone: this.signUpForm.value.phone,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
        companyName: this.signUpForm.value.companyName,
        address: address,
        role: 'vendor'
      };
      
      console.log('Vendor Sign Up Payload:', payload);
      
      // Here you would normally call your API service
      // this.authService.registerVendor(payload).subscribe(
      //   response => {
      //     // Handle successful registration
      //     this.router.navigate(['/dashboard/vendor']);
      //   },
      //   error => {
      //     // Handle error
      //     console.error('Registration failed', error);
      //   }
      // );
      
      // For now, navigate directly to demonstrate the routing
      this.router.navigate(['/dashboard/vendor']);
      
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signUpForm.controls).forEach(key => {
        this.signUpForm.get(key)?.markAsTouched();
      });
    }
  }
}

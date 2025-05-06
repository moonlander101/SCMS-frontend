import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router

// Define product interface for type safety
interface Product {
  id: number;
  name: string;
}

@Component({
  selector: 'app-supplier-signup',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './supplier-signup.component.html',
  styleUrl: './supplier-signup.component.css'
})
export class SupplierSignupComponent implements OnInit, AfterViewInit {
  signInForm: FormGroup;
  signUpForm: FormGroup;
  isSignUpMode = false;
  currentStep = 1;
  
  // Simplified list of 10 products
  products: Product[] = [
    { id: 1, name: 'Spice-1' },
    { id: 2, name: 'Spice-2' },
    { id: 3, name: 'Spice-3' },
    { id: 4, name: 'Spice-4' },
    { id: 5, name: 'Spice-5' },
    { id: 6, name: 'Spice-6' },
    { id: 7, name: 'Spice-7' },
    { id: 8, name: 'Spice-8' },
    { id: 9, name: 'Spice-9' },
    { id: 10, name: 'Spice-10' }
  ];

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
      
      // Step 2: Product Selection (simplified)
      product: ['', Validators.required],
      
      // Step 3: Company Details
      companyName: ['', Validators.required],
      streetNo: ['', Validators.required],
      streetName: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      
      // Step 4: Account Setup
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
      case 3:
        return this.validateStep3();
      default:
        return true;
    }
  }

  validateStep1(): boolean {
    const step1Fields = ['firstName', 'lastName', 'username', 'phone'];
    return this.validateFields(step1Fields);
  }

  validateStep2(): boolean {
    const step2Fields = ['product'];
    return this.validateFields(step2Fields);
  }

  validateStep3(): boolean {
    const step3Fields = ['companyName', 'streetNo', 'streetName', 'city', 'zipCode'];
    return this.validateFields(step3Fields);
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
      // this.router.navigate(['/dashboard/supplier']);
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
        productId: this.signUpForm.value.product,
        role: 'supplier'
      };
      
      console.log('Supplier Sign Up Payload:', payload);
      
      // Here you would normally call your API service
      // this.authService.registerSupplier(payload).subscribe(
      //   response => {
      //     // Handle successful registration
      //     this.router.navigate(['/dashboard/supplier']);
      //   },
      //   error => {
      //     // Handle error
      //     console.error('Registration failed', error);
      //   }
      // );
      
      // For now, navigate directly to demonstrate the routing
      this.router.navigate(['/dashboard/supplier']);
      
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signUpForm.controls).forEach(key => {
        this.signUpForm.get(key)?.markAsTouched();
      });
    }
  }
}

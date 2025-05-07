import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink]
})
export class CartSummaryComponent implements OnInit {
  cartItems: CartItem[] = [];
  shippingForm: FormGroup;
  shippingCost: number = 5.99;
  taxRate: number = 7;
  discountCode: string = '';
  discountApplied: boolean = false;
  discountAmount: number = 0;
  user = { name: 'Guest User' }; // Placeholder, would normally come from a user service

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]]
    });
  }

  ngOnInit(): void {
    // Load cart items from local storage or service
    this.loadCartItems();
    // Load user data if available
    this.loadUserData();
  }

  loadCartItems(): void {
    // This would typically come from a service or localStorage
    // For demo purposes, we'll initialize with some sample data
    this.cartItems = [
      {
        id: 1,
        name: 'Product 1',
        description: 'High-quality product with premium features',
        price: 49.99,
        quantity: 2,
        image: '/assets/images/product1.jpg'
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Versatile and durable for everyday use',
        price: 29.99,
        quantity: 1,
        image: '/assets/images/product2.jpg'
      }
    ];
  }

  loadUserData(): void {
    // In a real app, this would load data from a user service
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      
      // Pre-fill the form with user data if available
      const userData = JSON.parse(savedUser);
      if (userData.address) {
        this.shippingForm.patchValue({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          address: userData.address.street || '',
          city: userData.address.city || '',
          country: userData.address.country || '',
          postalCode: userData.address.postalCode || '',
          phone: userData.phone || ''
        });
      }
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity += 1;
    this.updateCart();
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity -= 1;
      this.updateCart();
    }
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
    this.updateCart();
  }

  updateCart(): void {
    // Update cart in local storage or service
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  getSubtotal(): string {
    const subtotal = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return subtotal.toFixed(2);
  }

  calculateTax(): number {
    return (parseFloat(this.getSubtotal()) * this.taxRate) / 100;
  }

  getTotalItems(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotal(): string {
    const subtotal = parseFloat(this.getSubtotal());
    const tax = this.calculateTax();
    const total = subtotal + this.shippingCost + tax - this.discountAmount;
    return total.toFixed(2);
  }

  applyDiscount(): void {
    // Simple discount logic - could be expanded to check against valid codes from backend
    const validDiscountCodes = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'LOYAL15': 15
    };

    type DiscountCodeKey = keyof typeof validDiscountCodes;
    
    if (this.discountCode && (this.discountCode as DiscountCodeKey) in validDiscountCodes) {
      const discountPercent = validDiscountCodes[this.discountCode as DiscountCodeKey];
      this.discountAmount = (parseFloat(this.getSubtotal()) * discountPercent) / 100;
      this.discountApplied = true;
    } else {
      this.discountAmount = 0;
      this.discountApplied = false;
      // You could add an error message here
    }
  }

  canProceed(): boolean {
    return this.cartItems.length > 0 && this.shippingForm.valid;
  }

  proceedToPayment(): void {
    if (this.canProceed()) {
      // Save shipping information
      const shippingData = this.shippingForm.value;
      localStorage.setItem('shippingDetails', JSON.stringify(shippingData));
      
      // Navigate to payment page
      this.router.navigate(['/payment']);
    } else {
      // Mark all form fields as touched to trigger validation messages
      Object.keys(this.shippingForm.controls).forEach(key => {
        const control = this.shippingForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
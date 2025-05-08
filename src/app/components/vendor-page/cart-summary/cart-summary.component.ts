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

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink]
})
export class CartSummaryComponent implements OnInit {
  currentStep: 'summary' | 'payment' | 'confirmation' = 'summary';
  cartItems: CartItem[] = [];
  shippingForm: FormGroup;
  billingForm: FormGroup;
  paymentForm: FormGroup;
  
  shippingCost: number = 5.99;
  taxRate: number = 7;
  discountCode: string = '';
  discountApplied: boolean = false;
  discountAmount: number = 0;
  
  user = { name: 'Guest User' };
  sameAsShipping: boolean = true;
  
  paymentMethods: PaymentMethod[] = [
    { id: 'credit_card', name: 'Credit Card', icon: 'https://th.bing.com/th/id/R.d4653ffdddd3f73959889432f9d7d5f8?rik=0ZtmYR5u4PqXJQ&pid=ImgRaw&r=0' },
    { id: 'paypal', name: 'PayPal', icon: 'https://logodix.com/logo/370282.jpg' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: 'https://www.sevenjackpots.com/wp-content/uploads/2021/04/bank-transfer-logo.png' }
  ];
  
  selectedPaymentMethod: string = 'credit_card';
  orderNumber: string = '';
  orderDate: Date = new Date();

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

    this.billingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required]
    });

    this.paymentForm = this.fb.group({
      cardholderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16,19}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      saveCard: [false]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.loadUserData();
    this.generateOrderNumber();
  }

  loadCartItems(): void {
    // Load from localStorage or service
    const savedCart = localStorage.getItem('cart');
    this.cartItems = savedCart ? JSON.parse(savedCart) : [
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
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      
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

  generateOrderNumber(): void {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    this.orderNumber = `ORD-${randomNum}`;
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
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  getSubtotal(): number {
    return parseFloat((this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)).toFixed(2));
  }

  calculateTax(): number {
    return parseFloat((this.getSubtotal() * this.taxRate / 100).toFixed(2));
  }

  getTotalItems(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const tax = this.calculateTax();
    return parseFloat((subtotal + this.shippingCost + tax - this.discountAmount).toFixed(2));
  }

  applyDiscount(): void {
    const validDiscountCodes: { [key: string]: number } = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'LOYAL15': 15
    };

    if (this.discountCode && validDiscountCodes[this.discountCode]) {
      this.discountAmount = (this.getSubtotal() * validDiscountCodes[this.discountCode]) / 100;
      this.discountApplied = true;
    } else {
      this.discountAmount = 0;
      this.discountApplied = false;
    }
  }

  canProceed(): boolean {
    return this.cartItems.length > 0 && this.shippingForm.valid;
  }

  proceedToPayment(): void {
    if (this.canProceed()) {
      const shippingData = this.shippingForm.value;
      localStorage.setItem('shippingDetails', JSON.stringify(shippingData));
      this.currentStep = 'payment';
      this.updateBillingAddress();
    } else {
      Object.keys(this.shippingForm.controls).forEach(key => {
        this.shippingForm.get(key)?.markAsTouched();
      });
    }
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;
  }

  getSelectedPaymentMethod(): PaymentMethod | undefined {
    return this.paymentMethods.find(method => method.id === this.selectedPaymentMethod);
  }

  updateBillingAddress(): void {
    if (this.sameAsShipping) {
      const shippingData = this.shippingForm.value;
      this.billingForm.patchValue({
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        address: shippingData.address,
        city: shippingData.city,
        country: shippingData.country,
        postalCode: shippingData.postalCode
      });
    }
  }

  canCompleteOrder(): boolean {
    if (this.selectedPaymentMethod === 'credit_card') {
      return this.paymentForm.valid;
    }
    return true; // For other payment methods that don't require form validation
  }

  completeOrder(): void {
    if (this.canCompleteOrder()) {
      // In a real app, you would send the order to your backend here
      const orderData = {
        orderNumber: this.orderNumber,
        date: new Date(),
        items: this.cartItems,
        shipping: this.shippingForm.value,
        billing: this.sameAsShipping ? this.shippingForm.value : this.billingForm.value,
        payment: {
          method: this.selectedPaymentMethod,
          details: this.selectedPaymentMethod === 'credit_card' ? this.paymentForm.value : null
        },
        subtotal: this.getSubtotal(),
        shippingCost: this.shippingCost,
        tax: this.calculateTax(),
        discount: this.discountAmount,
        total: this.getTotal()
      };

      // Save order to localStorage (in a real app, you would send to backend)
      localStorage.setItem('currentOrder', JSON.stringify(orderData));
      
      // Clear cart
      localStorage.removeItem('cart');
      this.cartItems = [];
      
      // Move to confirmation step
      this.currentStep = 'confirmation';
    } else {
      if (this.selectedPaymentMethod === 'credit_card') {
        Object.keys(this.paymentForm.controls).forEach(key => {
          this.paymentForm.get(key)?.markAsTouched();
        });
      }
    }
  }

  backToSummary(): void {
    this.currentStep = 'summary';
  }
}
import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MapSelectorComponent } from '../map-selector/map-selector.component';
import * as L from 'leaflet';
import {
  WarehouseService,
  Warehouse,
} from '../../../service/warehouse/warehouse.service';
import {
  OrderService,
  CreateOrderRequest,
} from '../../../service/order/order.service';
import { jwtDecode } from 'jwt-decode';

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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MapSelectorComponent,
  ],
})
export class CartSummaryComponent implements OnInit, AfterViewInit {
  currentStep: 'summary' | 'delivery' | 'payment' | 'confirmation' = 'summary';
  cartItems: CartItem[] = [];
  shippingForm: FormGroup;
  deliveryForm: FormGroup;
  billingForm: FormGroup;
  paymentForm: FormGroup;

  // Map and location data
  selectedLat: number | null = null;
  selectedLng: number | null = null;
  locationAddress: string | null = null;

  // Add ViewChild for the confirmation map
  @ViewChild('confirmationMap') confirmationMapElement!: ElementRef;

  // Add map property
  confirmationMap?: L.Map;
  confirmationMarker?: L.Marker;

  shippingCost: number = 5.99;
  taxRate: number = 7;
  discountCode: string = '';
  discountApplied: boolean = false;
  discountAmount: number = 0;

  user = { name: 'Guest User' };
  sameAsShipping: boolean = true;

  paymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      name: 'Credit Card',
      icon: 'https://th.bing.com/th/id/R.d4653ffdddd3f73959889432f9d7d5f8?rik=0ZtmYR5u4PqXJQ&pid=ImgRaw&r=0',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'https://logodix.com/logo/370282.jpg',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: 'https://www.sevenjackpots.com/wp-content/uploads/2021/04/bank-transfer-logo.png',
    },
  ];

  selectedPaymentMethod: string = 'credit_card';
  orderNumber: string = '';
  orderDate: Date = new Date();

  // UI state
  isCartPreviewOpen: boolean = false;
  isItemsCollapsed: boolean = false;
  isOrderSummaryItemsVisible: boolean = false;

  // Add these properties to your CartSummaryComponent class
  confirmedItemsCount: number = 0;
  confirmedSubtotal: string = '0.00';
  confirmedOrderItems: CartItem[] = [];

  // Add to the CartSummaryComponent class properties
  warehouses: Warehouse[] = [];
  selectedWarehouseId: number | null = null;
  selectedWarehouseName: string = '';
  isLoadingWarehouses: boolean = false;
  showWarehouseError: boolean = false;

  // Add these properties to your CartSummaryComponent class
  isProcessingPayment: boolean = false;
  paymentError: string | null = null;

  // Add this property to your component class
  isConfirmingOrder: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private warehouseService: WarehouseService,
    private orderService: OrderService // Add this line
  ) {
    // Initialize delivery form specifically for map-based delivery
    this.deliveryForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)],
      ],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')],
      ],
      instructions: [''],
      latitude: [null],
      longitude: [null],
    });

    // Initialize shipping form
    this.shippingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')],
      ],
      country: ['United States', Validators.required],
    });

    // Initialize billing form
    this.billingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')],
      ],
      country: ['United States', Validators.required],
    });

    // Initialize payment form
    this.paymentForm = this.fb.group({
      cardholderName: ['', Validators.required],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{16,19}$')],
      ],
      expiryDate: [
        '',
        [
          Validators.required,
          Validators.pattern('^(0[1-9]|1[0-2])/?([0-9]{2})$'),
        ],
      ],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      saveCard: [false],
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.loadUserData();
    this.generateOrderNumber();
    this.fetchWarehouses(); // Add this line

    // Ensure Leaflet marker icons work properly
    if (!L.Icon.Default.imagePath) {
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png',
      });
    }
  }

  ngAfterViewInit(): void {
    // If we're in confirmation step right on load, initialize map
    // (normally this happens in completeOrder)
    if (
      this.currentStep === 'confirmation' &&
      this.selectedLat &&
      this.selectedLng
    ) {
      this.initConfirmationMap();
    }
  }

  // Initialize confirmation map
  initConfirmationMap(): void {
    // Wait for the DOM to be ready
    setTimeout(() => {
      if (this.confirmationMapElement && this.selectedLat && this.selectedLng) {
        // Create the map
        this.confirmationMap = L.map(
          this.confirmationMapElement.nativeElement
        ).setView([this.selectedLat, this.selectedLng], 15);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(this.confirmationMap);

        // Add marker for delivery location
        this.confirmationMarker = L.marker([this.selectedLat, this.selectedLng])
          .addTo(this.confirmationMap)
          .bindPopup('Your delivery location')
          .openPopup();
      }
    }, 100);
  }

  loadCartItems(): void {
    const savedCart = localStorage.getItem('cart');
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];
  }

  loadUserData(): void {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  generateOrderNumber(): void {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }

  toggleCartPreview(): void {
    this.isCartPreviewOpen = !this.isCartPreviewOpen;
  }

  toggleItemsCollapse(): void {
    this.isItemsCollapsed = !this.isItemsCollapsed;
  }

  toggleOrderSummaryItems(): void {
    this.isOrderSummaryItemsVisible = !this.isOrderSummaryItemsVisible;
  }

  // UPDATED: Enhanced location selection method
  onLocationSelected(coords: { lat: number; lng: number }): void {
    this.selectedLat = coords.lat;
    this.selectedLng = coords.lng;

    // Update the form with coordinates
    this.deliveryForm.patchValue({
      latitude: coords.lat,
      longitude: coords.lng,
    });

    // Optionally: Try to reverse geocode to get address
    this.getAddressFromCoordinates(coords.lat, coords.lng);
  }

  // UPDATED: Enhanced address lookup with loading state
  getAddressFromCoordinates(lat: number, lng: number): void {
    // In a real application, you would make an API call to a geocoding service
    // For now, we'll just simulate this with a placeholder

    // Simulate a loading state
    this.locationAddress = 'Loading address...';

    // Simulate API call delay
    setTimeout(() => {
      this.locationAddress = 'Location near Colombo, Sri Lanka';
    }, 1000);
  }

  // Close dropdown when clicking elsewhere
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const cartPreviewElement = (event.target as HTMLElement).closest(
      '.cart-dropdown'
    );
    const cartToggleButton = (event.target as HTMLElement).closest(
      '.cart-toggle'
    );

    if (!cartPreviewElement && !cartToggleButton && this.isCartPreviewOpen) {
      this.isCartPreviewOpen = false;
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): string {
    const subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return subtotal.toFixed(2);
  }

  calculateTax(): number {
    const subtotal = parseFloat(this.getSubtotal());
    return (subtotal * this.taxRate) / 100;
  }

  getTotal(): string {
    const subtotal = parseFloat(this.getSubtotal());
    const tax = this.calculateTax();
    const total = subtotal + tax + this.shippingCost - this.discountAmount;
    return total.toFixed(2);
  }

  applyDiscount(): void {
    // Example discount codes
    const discountCodes = {
      SAVE10: 10,
      WELCOME15: 15,
      SPRING20: 20,
    };

    const code = this.discountCode.toUpperCase();

    // Check if valid discount code
    if (code && Object.keys(discountCodes).includes(code)) {
      const percentage = discountCodes[code as keyof typeof discountCodes];
      const subtotal = parseFloat(this.getSubtotal());
      this.discountAmount = (subtotal * percentage) / 100;
      this.discountApplied = true;

      // Show success alert or notification
      alert(`Discount of ${percentage}% applied successfully!`);
    } else {
      this.discountApplied = false;
      this.discountAmount = 0;

      // Show error alert or notification
      alert('Invalid discount code. Please try another code.');
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
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  proceedToDelivery(): void {
    if (this.cartItems.length > 0) {
      this.currentStep = 'delivery';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  canProceedFromDelivery(): boolean {
    return (
      this.deliveryForm.valid &&
      this.selectedLat !== null &&
      this.selectedLng !== null
    );
  }

  completeOrder(): void {
    if (this.paymentForm.valid && this.cartItems.length > 0) {
      // Here we would typically submit the order to the backend
      // Include the delivery location coordinates

      const orderData = {
        items: this.cartItems,
        delivery: {
          ...this.deliveryForm.value,
          coordinates: {
            lat: this.selectedLat,
            lng: this.selectedLng,
          },
        },
        payment: this.paymentForm.value,
        total: parseFloat(this.getTotal()),
        orderNumber: this.orderNumber,
      };

      console.log('Order data to submit:', orderData);

      // For demo purposes, we just proceed to confirmation
      this.currentStep = 'confirmation';

      // Clear cart after successful order
      this.cartItems = [];
      localStorage.removeItem('cart');

      // Initialize the confirmation map to show delivery location
      this.initConfirmationMap();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Add these to your component class
  continueShopping() {
    // Clear cart
    this.cartItems = [];
    localStorage.removeItem('cart');

    // Navigate to products page
    this.router.navigate(['/dashboard/vendor/product-section']);
  }

  trackOrder() {
    this.router.navigate(['/dashboard/vendor/order-history']);
  }

  goToCheckout(): void {
    this.isCartPreviewOpen = false;

    if (this.cartItems.length === 0) {
      // Don't proceed if cart is empty
      return;
    }

    if (this.currentStep === 'summary') {
      // If already on summary, proceed to delivery
      this.proceedToDelivery();
    } else {
      // Otherwise, go to summary first
      this.currentStep = 'summary';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  // Add these properties to your component class
  showPaymentPopup: boolean = false;
  orderAccepted: boolean = false;

  // Add this method to handle payment acceptance
  // Modify the proceedToPayment method to ensure the popup appears
  proceedToPayment(): void {
    this.isProcessingPayment = true;
    this.paymentError = null;

    // Simulate network delay (remove in production)
    setTimeout(() => {
      try {
        // Validate the delivery form
        console.log(this.deliveryForm.value);
        if (this.deliveryForm.invalid) {
          this.deliveryForm.markAllAsTouched();
          this.paymentError =
            'Please complete all required delivery information.';
          this.isProcessingPayment = false;
          return;
        }

        // Check warehouse selection
        if (!this.selectedWarehouseId) {
          this.showWarehouseError = true;
          this.paymentError = 'Please select a warehouse for delivery.';
          this.isProcessingPayment = false;
          return;
        }

        // Validate coordinates
        if (!this.selectedLat || !this.selectedLng) {
          this.paymentError = 'Please select a delivery location on the map.';
          this.isProcessingPayment = false;
          return;
        }

        // Check if cart is empty (shouldn't happen but good to verify)
        if (this.cartItems.length === 0) {
          this.paymentError =
            'Your cart is empty. Please add items before proceeding.';
          this.isProcessingPayment = false;
          return;
        }

        // If all validations pass, show payment popup
        this.isProcessingPayment = false;
        this.showPaymentPopup = true;
      } catch (error) {
        console.error('Error processing payment request:', error);
        this.paymentError = 'An unexpected error occurred. Please try again.';
        this.isProcessingPayment = false;
      }
    }, 1000); // Simulated 1-second delay to show loading state
  }

  // Enhance the acceptOrder method to handle localStorage updates
  // Modify your acceptOrder method in cart-summary.component.ts
  acceptOrder(): void {
    this.isConfirmingOrder = true; // Start loading state

    try {
      // Save values for confirmation display
      this.confirmedItemsCount = this.getTotalItems();
      this.confirmedSubtotal = this.getSubtotal();

      // Get user ID from token or use default
      let userId = 1;
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload: any = jwtDecode(token);
          userId = payload.user_id || 1;
        } catch (error) {
          console.error('Error parsing user ID from token:', error);
        }
      }

      // Log cart items to debug the issue
      console.log('Cart items before mapping:', this.cartItems);

      // Create the exact order format expected by the backend
      const orderData = {
        user_id: userId,
        details: {
          warehouse_id: this.selectedWarehouseId || 1,
          warehouse_name: this.selectedWarehouseName,
          first_name: this.deliveryForm.get('firstName')?.value,
          last_name: this.deliveryForm.get('lastName')?.value,
          phone: this.deliveryForm.get('phone')?.value,
          address: this.deliveryForm.get('address')?.value,
          city: this.deliveryForm.get('city')?.value,
          state: this.deliveryForm.get('state')?.value,
          zipcode: this.deliveryForm.get('zipCode')?.value,
          latitude: this.selectedLat?.toString() || '0',
          longitude: this.selectedLng?.toString() || '0',
          instructions: this.deliveryForm.get('instructions')?.value || '',
        },
        products: this.cartItems.map((item) => {
          // Ensure product_id is included and is a number
          return {
            product_id: Number(item.id), // Force conversion to number
            count: item.quantity,
          };
        }),
      };

      // Only add instructions if it exists (to match exact format)
      const instructions = this.deliveryForm.get('instructions')?.value;
      if (instructions) {
        orderData.details.instructions = instructions;
      }

      console.log('Sending order to API:', JSON.stringify(orderData));

      // Send order to the backend
      this.orderService.createOrder(orderData).subscribe({
        next: (response) => {
          console.log('Order created successfully:', response);
          this.isConfirmingOrder = false; // End loading state

          // Save to localStorage for offline access
          this.saveOrderToLocalStorage(response.order_id || this.orderNumber);

          // Update UI
          this.showPaymentPopup = false;
          this.orderAccepted = true;
          this.currentStep = 'confirmation';

          // Clear cart
          this.cartItems = [];
          localStorage.removeItem('cart');

          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Hide success message after delay
          setTimeout(() => {
            this.orderAccepted = false;
          }, 5000);
        },
        error: (error) => {
          console.error('API order creation failed:', error);
          this.isConfirmingOrder = false; // End loading state
          // Fall back to localStorage in case of API failure
          this.saveOrderToLocalStorage(this.orderNumber);
        },
      });
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please try again.');
      this.isConfirmingOrder = false; // End loading state on error
    }
  }

  // Helper method to save to localStorage
  private saveOrderToLocalStorage(orderId: string | number): void {
    // Create order data object for localStorage
    const orderData = {
      orderNumber: typeof orderId === 'string' ? orderId : `ORD-${orderId}`,
      orderDate: this.orderDate,
      items: [...this.cartItems],
      total: this.calculateConfirmedTotal().toFixed(2),
      paymentMethod: 'cash_on_delivery',
      warehouseId: this.selectedWarehouseId,
      warehouseName: this.selectedWarehouseName,
      deliveryAddress: {
        firstName: this.deliveryForm.get('firstName')?.value,
        lastName: this.deliveryForm.get('lastName')?.value,
        phone: this.deliveryForm.get('phone')?.value,
        address: this.deliveryForm.get('address')?.value,
        city: this.deliveryForm.get('city')?.value,
        state: this.deliveryForm.get('state')?.value,
        zipCode: this.deliveryForm.get('zipCode')?.value,
        instructions: this.deliveryForm.get('instructions')?.value,
        coordinates: {
          lat: this.selectedLat,
          lng: this.selectedLng,
        },
      },
      status: 'processing',
    };

    // Get existing orders from localStorage or initialize empty array
    const existingOrders = localStorage.getItem('orders');
    let orders = existingOrders ? JSON.parse(existingOrders) : [];

    // Add new order
    orders.push(orderData);

    // Update localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    console.log('Order saved to localStorage:', orderData);
  }

  // Add these methods to your CartSummaryComponent class
  parseSubtotal(value: string): number {
    return parseFloat(value) || 0;
  }

  calculateConfirmedTax(): number {
    return (this.parseSubtotal(this.confirmedSubtotal) * this.taxRate) / 100;
  }

  calculateConfirmedTotal(): number {
    return (
      this.parseSubtotal(this.confirmedSubtotal) +
      this.calculateConfirmedTax() +
      this.shippingCost
    );
  }

  fetchWarehouses(): void {
    this.isLoadingWarehouses = true;
    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouses = data;
        this.isLoadingWarehouses = false;
      },
      error: (error) => {
        console.error('Error fetching warehouses:', error);
        this.isLoadingWarehouses = false;
      },
    });
  }

  selectWarehouse(warehouseId: number): void {
    this.selectedWarehouseId = warehouseId;
    this.showWarehouseError = false;
    // Store warehouse name for display on confirmation
    const selectedWarehouse = this.warehouses.find((w) => w.id === warehouseId);
    if (selectedWarehouse) {
      this.selectedWarehouseName = selectedWarehouse.warehouse_name;
    }
  }

  // Add this debugging function
  inspectCartItems(): void {
    console.log('Detailed cart inspection:');

    if (this.cartItems && this.cartItems.length > 0) {
      this.cartItems.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          id: item.id,
          type: typeof item.id,
          name: item.name,
          quantity: item.quantity,
        });
      });
    } else {
      console.log('Cart is empty or undefined');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css',
})
export class OrderSummaryComponent implements OnInit {
  user = { 
    name: 'Prabath',
    email: 'prabath@example.com',
    role: 'Customer'
  };
  
  order = {
    id: 'ORD123456',
    date: '2025-05-07',
    shippingAddress: '123 Main Street, Colombo, Sri Lanka',
    status: 'Processing',
    shippingCost: 5.99,
    tax: 2.50,
    estimatedDelivery: '2025-05-14'
  };

  orderItems = [
    {
      name: 'Ceylon Cinnamon',
      quantity: 2,
      price: 10.0,
      image: 'path/to/image1.jpg',
      description: 'Premium quality Ceylon cinnamon sticks, 100g package',
      status: 'Processing'
    },
    {
      name: 'Black Pepper',
      quantity: 1,
      price: 5.5,
      image: 'path/to/image2.jpg',
      description: 'Organic black pepper, 50g package',
      status: 'Processing'
    },
  ];
  
  // Order progress tracking
  orderSteps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
  currentStep = 1; // 0-based index (1 = Processing)
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // Load order data from localStorage if available
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      try {
        const orderData = JSON.parse(savedOrder);
        if (orderData.items && orderData.items.length > 0) {
          this.orderItems = orderData.items;
        }
        
        // Clear cart after successful order
        localStorage.removeItem('cart');
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
  }
  
  getSubtotal(): string {
    return this.orderItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  }

  getTotal(): string {
    const subtotal = parseFloat(this.getSubtotal());
    const shipping = this.order.shippingCost;
    const tax = this.order.tax;
    
    return (subtotal + shipping + tax).toFixed(2);
  }
  
  getFormattedDate(): string {
    const date = new Date(this.order.date);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  getEstimatedDelivery(): string {
    const date = new Date(this.order.estimatedDelivery);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  getProgressWidth(): string {
    const progress = ((this.currentStep + 1) / this.orderSteps.length) * 100;
    return `${progress}%`;
  }
  
  getStatusClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    
    switch(status.toLowerCase()) {
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'shipped':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }
  
  trackOrder(): void {
    // Implementation for order tracking functionality
    // This could navigate to a dedicated tracking page
    alert(`Tracking order ${this.order.id}...`);
  }
}
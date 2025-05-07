import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  user = {
    name: "Alice Fernando",
    role: "Tea Supplier",
  };
  
  cartItems: any[] = [];
  shippingCost: number = 5.99;
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.loadCartItems();
  }
  
  loadCartItems(): void {
    this.cartItems = JSON.parse(localStorage.getItem("cart") || '[]');
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.saveCartToStorage();
  }
  
  updateQuantity(index: number, quantity: number): void {
    if (quantity > 0) {
      this.cartItems[index].quantity = quantity;
      this.saveCartToStorage();
    }
  }
  
  saveCartToStorage(): void {
    localStorage.setItem("cart", JSON.stringify(this.cartItems));
  }

  getSubtotal(): string {
    let subtotal = 0;
    this.cartItems.forEach((item: any) => {
      subtotal += item.price * (item.quantity || 1);
    });
    return subtotal.toFixed(2);
  }
  
  getShipping(): string {
    return this.cartItems.length > 0 ? this.shippingCost.toFixed(2) : '0.00';
  }

  getTotal(): string {
    const subtotal = parseFloat(this.getSubtotal());
    const shipping = parseFloat(this.getShipping());
    return (subtotal + shipping).toFixed(2);
  }
  
  proceedToCheckout(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['order-summery']);
    }
  }
  
  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
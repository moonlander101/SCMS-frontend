import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Product {
  name: string;
  subtitle: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem {
  name: string;
  subtitle: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.css',
})
export class ProductSectionComponent implements OnInit, OnDestroy {
  selectedCategory = 'All';
  categories = ['All', 'Powders', 'Whole Spices', 'Blends'];
  selectedProduct: Product | null = null;
  selectedQuantity = 1;
  
  // Cart state
  cartCount = signal(0);
  cartItems = signal<CartItem[]>([]);

  products = [
    {
      name: 'Turmeric Powder',
      subtitle: 'Organic • 200g',
      price: 4.99,
      category: 'Powders',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Garam Masala',
      subtitle: 'Premium Blend • 150g',
      price: 6.49,
      category: 'Blends',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Cinnamon Sticks',
      subtitle: 'Ceylon • 100g',
      price: 3.99,
      category: 'Whole Spices',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Chili Powder',
      subtitle: 'Smoky Heat • 100g',
      price: 2.99,
      category: 'Powders',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Cloves',
      subtitle: 'Whole • 50g',
      price: 5.99,
      category: 'Whole Spices',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Black Pepper',
      subtitle: 'Tellicherry • 100g',
      price: 4.49,
      category: 'Whole Spices',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Cardamom Pods',
      subtitle: 'Green • 75g',
      price: 7.99,
      category: 'Whole Spices',
      image: 'assets/images/products/spices-bg1.jpg',
    },
    {
      name: 'Cumin Seeds',
      subtitle: 'Whole • 150g',
      price: 2.49,
      category: 'Whole Spices',
      image: 'assets/images/products/spices-bg1.jpg',
    },
  ];

  constructor() {
    this.loadCart();
  }

  get filteredProducts() {
    return this.selectedCategory === 'All'
      ? this.products
      : this.products.filter((p) => p.category === this.selectedCategory);
  }

  updateQuantity(value: string) {
    this.selectedQuantity = +value;
  }

  openProductModal(product: Product) {
    this.selectedProduct = product;
    this.selectedQuantity = 1; // Reset quantity when opening modal
  }

  closeProductModal() {
    this.selectedProduct = null;
  }

  addToCart(product: Product) {
    const currentCart = this.cartItems();
    const existingItem = currentCart.find(item => item.name === product.name);
    
    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += this.selectedQuantity;
    } else {
      // Add new item to cart
      currentCart.push({
        ...product,
        quantity: this.selectedQuantity
      });
    }

    // Update cart state
    this.cartItems.set([...currentCart]);
    this.cartCount.set(currentCart.reduce((sum) => sum + 1, 0));
    this.saveCart();
    this.closeProductModal();
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  private loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.set(JSON.parse(savedCart));
      this.cartCount.set(this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
    }
  }

  // Handle keyboard events
  ngOnInit(): void {
    window.addEventListener('keydown', this.handleKeydown);
  }
  
  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeydown);
  }
  
  handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.closeProductModal();
  };
}
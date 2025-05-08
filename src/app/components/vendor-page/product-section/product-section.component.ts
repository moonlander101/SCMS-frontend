import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, ApiProduct } from '../../../services/product.service';

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
  categories = [
    { id: 'All', name: 'All' },
    { id: 1, name: 'Powders' },
    { id: 2, name: 'Whole Spices' },
    { id: 3, name: 'Blends' }
  ];
  
  
  selectedCategory: string | number | 'All' = 'All'; // Default to 'All'

  
  categoryMap: { [key: number]: string } = {
    1: 'Powders',
    2: 'Whole Spices',
    3: 'Blends',
  };
  
  selectedProduct: Product | null = null;
  selectedQuantity = 1;
  
  // Cart state
  cartCount = signal(0);
  cartItems = signal<CartItem[]>([]);

  products: Product[] = []; // Store products dynamically

  constructor(private productService: ProductService) {
    this.loadCart();
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products: ApiProduct[]) => {
      this.products = products.map((product) => ({
        name: product.product_name,
        subtitle: 'Description',
        price: +product.unit_price,
        category: product.category, // keep as number
        image: 'assets/images/products/spices-bg1.jpg',
      }));
    });
    

    // Handle keyboard events
    window.addEventListener('keydown', this.handleKeydown);
  }

  get filteredProducts() {
    return this.selectedCategory === 'All'
      ? this.products
      : this.products.filter(product => product.category === this.selectedCategory);
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
  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.closeProductModal();
  };
}

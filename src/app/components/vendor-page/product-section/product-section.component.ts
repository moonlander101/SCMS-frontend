import { CommonModule } from '@angular/common';
import {
  Component,
  signal,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ProductService,
  Product,
  ApiProduct,
  ApiCategory,
} from '../../../service/warehouse/product.service';

interface CartItem {
  id: number; // Add this field
  name: string;
  subtitle: string;
  price: number;
  image: string;
  quantity: number;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.css',
})
export class ProductSectionComponent implements OnInit, OnDestroy {
  // Replace the hardcoded categories with a signal to hold API data
  categories = signal<{ id: number | 'All'; name: string }[]>([
    { id: 'All', name: 'All' },
  ]);

  selectedCategory: number | 'All' = 'All'; // Default to 'All'

  // This will hold the mapping from category ID to name
  categoryMap: { [key: number]: string } = {};

  selectedProduct: Product | null = null;
  selectedQuantity = 1;

  // Cart state
  cartCount = signal(0);
  cartItems = signal<CartItem[]>([]);

  // Notification state
  notifications = signal<Notification[]>([]);
  private notificationIdCounter = 0;

  products: Product[] = []; // Store products dynamically

  isCartPreviewOpen = false; // Track cart preview state

  // Add these properties to ProductSectionComponent
  isLoadingCategories = true;
  isLoadingProducts = true;

  constructor(private productService: ProductService, private router: Router) {
    this.loadCart();
  }

  ngOnInit(): void {
    // Fetch categories first
    this.isLoadingCategories = true;
    this.productService.getCategories().subscribe({
      next: (categories: ApiCategory[]) => {
        // Create "All" + API categories array
        const allCategories = [
          { id: 'All' as const, name: 'All' },
          ...categories.map((cat) => ({
            id: cat.id,
            name: cat.category_name,
          })),
        ];

        // Update categories signal
        this.categories.set(allCategories);

        // Build category map for lookup
        categories.forEach((cat) => {
          this.categoryMap[cat.id] = cat.category_name;
        });
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.showNotification('Failed to load categories', 'error');
        this.isLoadingCategories = false;
      },
    });

    // Fetch products
    this.isLoadingProducts = true;
    this.productService.getProducts().subscribe({
      next: (products: ApiProduct[]) => {
        this.products = products.map((product) => ({
          id: product.id, // Add the ID from the API product
          name: product.product_name,
          subtitle: `SKU: ${product.product_SKU}`,
          price: +product.unit_price,
          category: product.category,
          image: 'assets/images/products/spices-bg1.jpg', // Default image
        }));
        this.isLoadingProducts = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.showNotification('Failed to load products', 'error');
        this.isLoadingProducts = false;
      },
    });

    // Handle keyboard events
    window.addEventListener('keydown', this.handleKeydown);
  }

  get filteredProducts() {
    return this.selectedCategory === 'All'
      ? this.products
      : this.products.filter(
          (product) => product.category === this.selectedCategory
        );
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

  // Method to show notifications
  showNotification(
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) {
    const id = this.notificationIdCounter++;
    const notification = { message, type, id };

    // Add notification to array
    const currentNotifications = this.notifications();
    this.notifications.set([...currentNotifications, notification]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      this.dismissNotification(id);
    }, 3000);
  }

  dismissNotification(id: number) {
    const currentNotifications = this.notifications();
    this.notifications.set(currentNotifications.filter((n) => n.id !== id));
  }

  // Updated to match HTML parameters
  addToCart(product: Product) {
    const currentCart = this.cartItems();
    const existingItem = currentCart.find((item) => item.name === product.name);

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += this.selectedQuantity;
    } else {
      // Add new item to cart - FIX THE DUPLICATE ID ISSUE
      currentCart.push({
        ...product, // This already includes the id property
        quantity: this.selectedQuantity,
      });
    }

    // Update cart state
    this.cartItems.set([...currentCart]);
    this.cartCount.set(
      currentCart.reduce((sum, item) => sum + item.quantity, 0)
    );
    this.saveCart();

    // Show success notification
    this.showNotification(
      `Added ${this.selectedQuantity} ${product.name} to cart!`
    );

    this.closeProductModal();
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  private loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.set(JSON.parse(savedCart));
      this.cartCount.set(
        this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
      );
    }
  }

  // Handle keyboard events
  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.closeProductModal();
  };

  // Add the host listener to close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const cartToggle = document.querySelector('.cart-toggle');
    const cartDropdown = document.querySelector('.cart-dropdown');

    // Close the dropdown if the click is outside the cart area
    if (
      this.isCartPreviewOpen &&
      !cartToggle?.contains(target) &&
      !cartDropdown?.contains(target)
    ) {
      this.isCartPreviewOpen = false;
    }
  }

  // Toggle the cart preview
  toggleCartPreview() {
    this.isCartPreviewOpen = !this.isCartPreviewOpen;
  }

  // Get total items (just an alias for cartCount() if needed)
  getTotalItems() {
    return this.cartCount();
  }

  // Get subtotal for display
  getSubtotal() {
    return this.cartItems()
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  }

  // Navigate to cart
  viewCart() {
    this.router.navigate(['/dashboard/vendor/cart-summary']);
  }

  // Navigate to checkout page
  checkout() {
    this.router.navigate(['/dashboard/vendor/cart-summary']);
  }

  // Update the existing method for decreaseQuantity
  decreaseQuantity(index: number) {
    const currentCart = this.cartItems();
    if (currentCart[index].quantity > 1) {
      currentCart[index].quantity--;
    } else {
      // Remove item if quantity becomes 0
      this.removeItem(index);
      return;
    }

    this.cartItems.set([...currentCart]);
    this.updateCartCount();
    this.saveCart();
  }

  // Update the existing method for increaseQuantity
  increaseQuantity(index: number) {
    const currentCart = this.cartItems();
    currentCart[index].quantity++;
    this.cartItems.set([...currentCart]);
    this.updateCartCount();
    this.saveCart();
  }

  // Update the existing method for removeItem
  removeItem(index: number) {
    const currentCart = this.cartItems();
    currentCart.splice(index, 1);
    this.cartItems.set([...currentCart]);
    this.updateCartCount();
    this.saveCart();
  }

  // Update this in ProductSectionComponent
  removeAllItems() {
    // Correctly clear the signal
    this.cartItems.set([]);
    this.cartCount.set(0);
    localStorage.removeItem('cart');
  }

  // Helper to update the cart count
  private updateCartCount() {
    this.cartCount.set(
      this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
    );
  }

  // // Add this method to your component class:
  // getProductImage(category: number): string {
  //   // Return different images based on category
  //   switch(category) {
  //     case 1: return 'assets/images/products/cinnamon.jpg';
  //     case 2: return 'assets/images/products/pepper.jpg';
  //     case 3: return 'assets/images/products/cardamom.jpg';
  //     case 4: return 'assets/images/products/chili.jpg';
  //     default: return 'assets/images/products/spices-bg1.jpg';
  //   }
  // }
}

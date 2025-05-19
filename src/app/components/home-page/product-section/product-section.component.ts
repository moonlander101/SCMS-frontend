import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ProductService,
  ApiProduct,
  ApiCategory,
} from '../../../service/warehouse/product.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [
    CommonModule, // This includes NgFor and NgClass
    RouterLink,
    HttpClientModule,
  ],
  providers: [ProductService], // Add ProductService as provider since this is a standalone component
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.css',
})
export class ProductSectionComponent implements OnInit, OnDestroy {
  selectedCategory = 'All';
  categories: string[] = ['All']; // Will populate from API
  apiCategories: ApiCategory[] = [];
  apiProducts: ApiProduct[] = [];
  products: any[] = []; // Will populate from API
  isLoading = true;
  error: string | null = null;

  selectedProduct: any = null;

  constructor(
    private productService: ProductService,
    private router: Router // Add Router for navigation
  ) {}

  ngOnInit(): void {
    // Add event listener for Escape key
    window.addEventListener('keydown', this.handleKeydown);

    // Load data from API
    this.loadCategories();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.apiCategories = data;
        // Extract category names for the filter tabs
        const categoryNames = data.map((cat) => cat.category_name);
        this.categories = ['All', ...categoryNames];
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.error = 'Failed to load categories';
      },
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.apiProducts = data;
        // Transform API products to match the component's format
        this.products = data.map((product) =>
          this.mapApiProductToComponentFormat(product)
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.error = 'Failed to load products';
        this.isLoading = false;
      },
    });
  }

  // Map API product to the format expected by the component
  mapApiProductToComponentFormat(apiProduct: ApiProduct): any {
    // Find the category name based on the ID
    const category = this.apiCategories.find(
      (cat) => cat.id === apiProduct.category
    );
    const categoryName = category ? category.category_name : 'Other';

    return {
      id: apiProduct.id,
      name: apiProduct.product_name,
      subtitle: `SKU: ${apiProduct.product_SKU}`,
      price: parseFloat(apiProduct.unit_price),
      category: categoryName,
      image: 'assets/images/products/spices-bg1.jpg', // Default image
    };
  }

  get filteredProducts() {
    if (this.selectedCategory === 'All') {
      return this.products;
    } else {
      return this.products.filter((p) => p.category === this.selectedCategory);
    }
  }

  openProductModal(product: any) {
    this.selectedProduct = product;
  }

  closeProductModal() {
    this.selectedProduct = null;
  }

  handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.closeProductModal();
  };

  // Add this new method for auth redirection
  redirectToAuth(event: Event): void {
    // Prevent the event from bubbling up and closing the modal
    event.stopPropagation();

    // Close the product modal
    this.closeProductModal();

    // Navigate to the auth page
    this.router.navigate(['/auth']);
  }
}

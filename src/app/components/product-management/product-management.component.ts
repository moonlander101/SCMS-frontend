import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Likely needed for add/edit form
import { CommonModule } from '@angular/common'; // Ensure this is imported if standalone or in NgModule
import { ReactiveFormsModule } from '@angular/forms'; // Import if using reactive forms


interface Product {
  id: string | number; // Use appropriate type for your ID
  name: string;
  sku: string;
  description?: string; // Optional property
  price: number;
  // Add other product properties
}

@Component({
  standalone: true,
  selector: 'app-product-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})

export class ProductManagementComponent implements OnInit {

  // Properties for the component
  products: Product[] = [];
  productForm!: FormGroup; // For Add/Edit
  showAddForm: boolean = false;
  editingProduct: Product | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Inject FormBuilder and your ProductService
  constructor(
    private fb: FormBuilder /*,
    private productService: ProductService */ // Uncomment when service is ready
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      id: [null], // Keep track of id for editing
      name: ['', Validators.required],
      sku: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadProducts(): void {
    // TODO: Replace with actual service call
    // this.productService.getProducts().subscribe(data => this.products = data);
    console.log('Loading products...');
    // Placeholder:
    this.products = [
      { id: 'p1', name: 'Sample Item 1', sku: 'SKU001', price: 19.99 },
      { id: 'p2', name: 'Sample Item 2', sku: 'SKU002', price: 29.99, description: 'A second item' }
    ];
  }

  onSubmit(): void {
    // Logic for saving/updating product using this.productForm.value
    console.log('Form submitted:', this.productForm.value);
    this.successMessage = 'Product saved successfully!'; // Example message
    // Reset form, reload products etc.
     this.resetForm();
     this.loadProducts(); // Reload list after save/update
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue(product); // Load product data into form
    this.showAddForm = true; // Show the form
    this.successMessage = null;
    this.errorMessage = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

   resetForm(): void {
    this.editingProduct = null;
    this.productForm.reset();
    this.showAddForm = false;
    this.successMessage = null;
    this.errorMessage = null;
  }

  // --- ADD THIS METHOD ---
  deleteProduct(productId: string | number): void {
    // Optional: Add a confirmation dialog
    if (confirm(`Are you sure you want to delete product with ID: ${productId}?`)) {
      console.log('Attempting to delete product with ID:', productId);

      // TODO: Replace with actual service call
      // this.productService.deleteProduct(productId).subscribe({
      //   next: () => {
      //     console.log('Product deleted successfully');
      //     this.successMessage = 'Product deleted successfully!';
      //     // Remove the product from the local list to update UI instantly
      //     this.products = this.products.filter(p => p.id !== productId);
      //     this.errorMessage = null;
      //   },
      //   error: (err) => {
      //     console.error('Error deleting product:', err);
      //     this.errorMessage = 'Failed to delete product. Please try again.';
      //     this.successMessage = null;
      //   }
      // });

      // --- Placeholder for testing without service ---
       this.products = this.products.filter(p => p.id !== productId);
       this.successMessage = `Placeholder: Product ${productId} deleted.`;
       this.errorMessage = null;
       console.log(`Placeholder: Deleted product ${productId}`);
      // --- End Placeholder ---
    }
  }
  // --- END OF METHOD ---

}
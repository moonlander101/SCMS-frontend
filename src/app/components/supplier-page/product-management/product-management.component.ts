import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

// Interface for the data from your LISTING API
interface ApiProductListItem {
  product_name: string;
  SKU: string;
  supplier_price: number;
  warehouses: string[]; // Names of warehouses
}

// Interface for your component's product structure (for display in table)
interface ProductDisplay {
  name: string;
  sku: string;
  price: number;
  warehouses: string[]; // Names of warehouses this product is in
  description?: string;
}

// Interface for warehouse selection (with ID)
interface Warehouse {
  id: number;
  name: string;
}

// Interface for predefined product selection
interface PredefinedProduct {
  name: string;
  id: number; // The actual product_id
  sku: string; // The generated SKU
}

@Component({
  standalone: true,
  selector: 'app-product-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
  providers: [CurrencyPipe]
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  products: ProductDisplay[] = [];

  isAddProductToWarehouseModalOpen: boolean = false;
  addProductToWarehouseForm!: FormGroup;
  predefinedProductsForDropdown: PredefinedProduct[] = [];

  editPriceForm!: FormGroup;
  isEditPriceModalOpen: boolean = false;
  productForPriceEdit: ProductDisplay | null = null;
  filteredWarehousesForModal: Warehouse[] = [];

  readonly allAvailableWarehouses: Warehouse[] = [
    { id: 1, name: 'Colombo Central' },
    { id: 2, name: 'Kandy Depot' },
    { id: 3, name: 'Kurunegala Rock' }
  ];

  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  private get supplierId(): number {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return 0;
      }
      const decoded: any = jwtDecode(token);
      if (!decoded || !decoded.user_id) {
        console.error('User ID not found in token');
        return 0;
      }
      return decoded.user_id;
    } catch (error) {
      console.error('Failed to decode authentication token:', error);
      return 0;
    }
  }

  private readonly PRODUCT_LIST_API_URL = 'http://127.0.0.1:8001/api/warehouse/supplier-product/prices/';
  // Assuming Django URL is fixed to use a single slash:
  private readonly ADD_OR_UPDATE_PRICE_API_URL = 'http://127.0.0.1:8001/api/warehouse//supplier-product/add_or_update/';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.generatePredefinedProducts();
    this.initAddProductToWarehouseForm();
    this.initEditPriceForm();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generatePredefinedProducts(): void {
    const productNames = [
      'Chili Product 1', 'Cinnamon Product 2', 'Pepper Product 3', 'Cinnamon Product 4',
      'Chili Product 5', 'Cinnamon Product 6', 'Pepper Product 7', 'Pepper Product 8',
      'Chili Product 9', 'Cinnamon Product 10'
    ];
    this.predefinedProductsForDropdown = productNames.map(name => {
      const id = this.extractProductIdFromName(name);
      return {
        name: name,
        id: id || 0,
        sku: this.generateSku(id) // SKU is generated here
      };
    });
  }

  initAddProductToWarehouseForm(): void {
    this.addProductToWarehouseForm = this.fb.group({
      selected_product_id: [null, Validators.required],
      sku_display: [{ value: '', disabled: true }], // Disabled input for SKU
      warehouse_id: [null, Validators.required],
      supplier_price: [null, [Validators.required, Validators.min(0)]],
      lead_time_days: [null, [Validators.required, Validators.min(1)]],
      maximum_capacity: [null, [Validators.required, Validators.min(1)]]
    });

    // Auto-update SKU when product changes
    this.addProductToWarehouseForm.get('selected_product_id')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(productId => {
        const selectedProduct = this.predefinedProductsForDropdown.find(p => p.id === productId);
        this.addProductToWarehouseForm.get('sku_display')?.setValue(selectedProduct ? selectedProduct.sku : '');
      });
  }

  initEditPriceForm(): void {
    this.editPriceForm = this.fb.group({
      warehouse_id: [null, Validators.required],
      supplier_price: [null, [Validators.required, Validators.min(0)]]
    });
  }

  // Helper to generate SKU "SKUXXX"
  generateSku(productId: number | null): string {
    if (productId === null || productId === 0) return 'N/A'; // Or some placeholder
    return `SKU${String(productId).padStart(3, '0')}`;
  }

  // Helper to extract product ID from name "Product Name X"
  extractProductIdFromName(productName: string): number | null {
    const match = productName.match(/\s(\d+)$/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    console.warn(`Could not extract product ID from name: ${productName}`);
    return null;
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.products = [];
    const apiUrl = `${this.PRODUCT_LIST_API_URL}?supplier_id=${this.supplierId}`;

    this.http.get<ApiProductListItem[]>(apiUrl).pipe(
      map(apiDataArray =>
        apiDataArray.map(apiItem => ({
          name: apiItem.product_name,
          sku: apiItem.SKU, // This SKU comes from the API for existing products
          price: apiItem.supplier_price,
          warehouses: apiItem.warehouses || []
        }))
      ),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching products:', error);
        this.errorMessage = `Failed to load product catalogue: ${error.statusText || 'Unknown error'}`;
        return of([]);
      })
    ).subscribe({
      next: (transformedProducts) => {
        this.products = transformedProducts;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  openAddProductToWarehouseModal(): void {
    this.isAddProductToWarehouseModalOpen = true;
    this.addProductToWarehouseForm.reset();
    this.addProductToWarehouseForm.get('sku_display')?.setValue('');
    this.clearMessages();
  }

  closeAddProductToWarehouseModal(): void {
    this.isAddProductToWarehouseModalOpen = false;
    this.addProductToWarehouseForm.reset();
  }

  onAddProductToWarehouseSubmit(): void {
    if (this.addProductToWarehouseForm.invalid) {
      this.showGeneralFormError("Please complete all required fields with valid values.");
      return;
    }
    this.isSubmitting = true;
    this.clearMessages();

    const formValue = this.addProductToWarehouseForm.value;
    const payload = {
      warehouse_id: Number(formValue.warehouse_id),
      supplier_id: this.supplierId,
      product_id: Number(formValue.selected_product_id),
      supplier_price: Number(formValue.supplier_price),
      lead_time_days: Number(formValue.lead_time_days),
      maximum_capacity: Number(formValue.maximum_capacity)
    };

    console.log('Adding product to warehouse with payload:', payload);
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    this.http.post(this.ADD_OR_UPDATE_PRICE_API_URL, payload, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding product to warehouse:', error);
        let detail = error.error && typeof error.error === 'object' ? JSON.stringify(error.error) : (error.error || error.message);
        this.showGeneralFormError(`Failed to add product: ${error.statusText || 'Unknown error'}. ${detail}`);
        this.isSubmitting = false;
        return throwError(() => error);
      })
    ).subscribe({
      next: (response) => {
        const selectedProduct = this.predefinedProductsForDropdown.find(p => p.id === payload.product_id);
        this.showGeneralFormSuccess(`Product "${selectedProduct?.name || 'Selected Product'}" successfully added/updated for the warehouse.`);
        this.isSubmitting = false;
        this.closeAddProductToWarehouseModal();
        this.loadProducts();
      },
      error: () => { this.isSubmitting = false; }
    });
  }

  openEditPriceModal(product: ProductDisplay): void {
    this.productForPriceEdit = product;
    this.editPriceForm.reset();
    this.clearMessages();

    if (product.warehouses && product.warehouses.length > 0) {
      this.filteredWarehousesForModal = this.allAvailableWarehouses.filter(wh =>
        product.warehouses.includes(wh.name)
      );
    } else {
      this.filteredWarehousesForModal = [];
    }
    if (this.filteredWarehousesForModal.length === 1) {
        this.editPriceForm.patchValue({ warehouse_id: this.filteredWarehousesForModal[0].id });
    }
    this.isEditPriceModalOpen = true;
  }

  closeEditPriceModal(): void {
    this.isEditPriceModalOpen = false;
    this.productForPriceEdit = null;
    this.filteredWarehousesForModal = [];
    this.editPriceForm.reset();
  }

  onUpdatePriceSubmit(): void {
    if (!this.productForPriceEdit || this.editPriceForm.invalid) {
      this.showGeneralFormError("Modal Error: Please select a warehouse and enter a valid price.");
      return;
    }
    this.isSubmitting = true;
    this.clearMessages();

    const productId = this.extractProductIdFromName(this.productForPriceEdit.name);
    if (productId === null) {
      this.showGeneralFormError(`Modal Error: Could not determine Product ID for "${this.productForPriceEdit.name}".`);
      this.isSubmitting = false;
      return;
    }

    const formValue = this.editPriceForm.value;
    const payload = {
      warehouse_id: Number(formValue.warehouse_id),
      supplier_id: this.supplierId,
      product_id: productId,
      supplier_price: Number(formValue.supplier_price)
    };
    console.log('Updating price with payload:', payload);
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    this.http.post(this.ADD_OR_UPDATE_PRICE_API_URL, payload, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating price:', error);
        let detail = error.error && typeof error.error === 'object' ? JSON.stringify(error.error) : (error.error || error.message);
        this.showGeneralFormError(`Modal Error: Failed to update price: ${error.statusText}. ${detail}`);
        this.isSubmitting = false;
        return throwError(() => error);
      })
    ).subscribe({
      next: (response) => {
        this.showGeneralFormSuccess(`Price for "${this.productForPriceEdit?.name}" updated successfully.`);
        this.isSubmitting = false;
        this.closeEditPriceModal();
        this.loadProducts();
      },
      error: () => { this.isSubmitting = false; }
    });
  }

  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }
  showGeneralFormError(message: string): void {
    this.errorMessage = message;
    this.successMessage = null;
  }
  showGeneralFormSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = null;
  }
}
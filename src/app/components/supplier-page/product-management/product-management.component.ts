import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, throwError, forkJoin } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import {
  ProductService,
  ApiProduct,
} from '../../../service/warehouse/product.service';
import {
  WarehouseService,
  Warehouse as ApiWarehouse,
} from '../../../service/warehouse/warehouse.service';
import {
  ProductManagementService,
  ProductDisplay,
  AddPricePayload,
} from '../../../service/supplier/product-management.service';

// Interface for warehouse selection (with ID)
interface Warehouse {
  id: number;
  name: string;
}

@Component({
  standalone: true,
  selector: 'app-product-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
  providers: [CurrencyPipe],
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  products: ProductDisplay[] = [];
  availableProducts: ApiProduct[] = [];
  allAvailableWarehouses: Warehouse[] = [];

  isAddProductToWarehouseModalOpen: boolean = false;
  addProductToWarehouseForm!: FormGroup;

  editPriceForm!: FormGroup;
  isEditPriceModalOpen: boolean = false;
  productForPriceEdit: ProductDisplay | null = null;
  filteredWarehousesForModal: Warehouse[] = [];

  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  // First-time user properties
  isFirstTimeUser: boolean = false;
  hasCheckedFirstTimeStatus: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private productManagementService: ProductManagementService
  ) {}

  ngOnInit(): void {
    this.initAddProductToWarehouseForm();
    this.initEditPriceForm();

    // Load available products and supplier products
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Fetch all required data
  fetchData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Use forkJoin to fetch all data sets in parallel
    forkJoin({
      availableProducts: this.productService.getProducts(),
      supplierProducts: this.productManagementService.getSupplierProducts(),
      warehouses: this.warehouseService.getWarehouses(),
    }).subscribe({
      next: (result) => {
        this.availableProducts = result.availableProducts;
        this.products = result.supplierProducts;

        // Transform warehouse API response to match our local interface
        this.allAvailableWarehouses = result.warehouses.map((wh) => ({
          id: wh.id,
          name: wh.warehouse_name,
        }));

        // Check if this is a first-time user (no products)
        if (!this.hasCheckedFirstTimeStatus) {
          this.isFirstTimeUser = this.products.length === 0;
          this.hasCheckedFirstTimeStatus = true;

          // Store first-time status in localStorage
          if (this.isFirstTimeUser) {
            localStorage.setItem('supplier_first_time', 'true');
          }
        }

        // Update first-time status if they now have products
        if (
          this.products.length > 0 &&
          localStorage.getItem('supplier_first_time') === 'true'
        ) {
          localStorage.removeItem('supplier_first_time');
          this.isFirstTimeUser = false;
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.errorMessage = 'Failed to load data. Please try again.';
        this.isLoading = false;
      },
    });
  }

  initAddProductToWarehouseForm(): void {
    this.addProductToWarehouseForm = this.fb.group({
      selected_product_id: [null, Validators.required],
      sku_display: [{ value: '', disabled: true }],
      warehouse_id: [null, Validators.required],
      supplier_price: [null, [Validators.required, Validators.min(0)]],
      lead_time_days: [null, [Validators.required, Validators.min(1)]],
      maximum_capacity: [null, [Validators.required, Validators.min(1)]],
    });

    // Auto-update SKU when product changes
    this.addProductToWarehouseForm
      .get('selected_product_id')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((productId) => {
        const selectedProduct = this.availableProducts.find(
          (p) => p.id === productId
        );
        this.addProductToWarehouseForm
          .get('sku_display')
          ?.setValue(selectedProduct ? selectedProduct.product_SKU : '');
      });
  }

  initEditPriceForm(): void {
    this.editPriceForm = this.fb.group({
      warehouse_id: [null, Validators.required],
      supplier_price: [null, [Validators.required, Validators.min(0)]],
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
      this.showGeneralFormError(
        'Please complete all required fields with valid values.'
      );
      return;
    }
    this.isSubmitting = true;
    this.clearMessages();

    const formValue = this.addProductToWarehouseForm.value;
    const payload: AddPricePayload = {
      warehouse_id: Number(formValue.warehouse_id),
      supplier_id: this.productManagementService.supplierId,
      product_id: Number(formValue.selected_product_id),
      supplier_price: Number(formValue.supplier_price),
      lead_time_days: Number(formValue.lead_time_days),
      maximum_capacity: Number(formValue.maximum_capacity),
    };

    console.log('Adding product to warehouse with payload:', payload);

    this.productManagementService
      .addOrUpdateProductPrice(payload)
      .pipe(
        catchError((error) => {
          let detail =
            error.error && typeof error.error === 'object'
              ? JSON.stringify(error.error)
              : error.error || error.message;
          this.showGeneralFormError(
            `Failed to add product: ${
              error.statusText || 'Unknown error'
            }. ${detail}`
          );
          this.isSubmitting = false;
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          const selectedProduct = this.availableProducts.find(
            (p) => p.id === payload.product_id
          );
          this.showGeneralFormSuccess(
            `Product "${
              selectedProduct?.product_name || 'Selected Product'
            }" successfully added/updated for the warehouse.`
          );
          this.isSubmitting = false;
          this.closeAddProductToWarehouseModal();
          this.fetchData(); // Reload products data
        },
        error: () => {
          this.isSubmitting = false;
        },
      });
  }

  openEditPriceModal(product: ProductDisplay): void {
    this.productForPriceEdit = product;
    this.editPriceForm.reset();
    this.clearMessages();

    if (product.warehouses && product.warehouses.length > 0) {
      this.filteredWarehousesForModal = this.allAvailableWarehouses.filter(
        (wh) => product.warehouses.includes(wh.name)
      );
    } else {
      this.filteredWarehousesForModal = [];
    }
    if (this.filteredWarehousesForModal.length === 1) {
      this.editPriceForm.patchValue({
        warehouse_id: this.filteredWarehousesForModal[0].id,
      });
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
      this.showGeneralFormError(
        'Please select a warehouse and enter a valid price.'
      );
      return;
    }
    this.isSubmitting = true;
    this.clearMessages();

    // Find the product ID from our product list by matching SKU
    const matchingProduct = this.availableProducts.find(
      (p) => p.product_SKU === this.productForPriceEdit?.sku
    );

    if (!matchingProduct) {
      this.showGeneralFormError(
        `Could not find product with SKU "${this.productForPriceEdit.sku}".`
      );
      this.isSubmitting = false;
      return;
    }

    const formValue = this.editPriceForm.value;
    const payload: AddPricePayload = {
      warehouse_id: Number(formValue.warehouse_id),
      supplier_id: this.productManagementService.supplierId,
      product_id: matchingProduct.id,
      supplier_price: Number(formValue.supplier_price),
    };

    console.log('Updating price with payload:', payload);

    this.productManagementService
      .addOrUpdateProductPrice(payload)
      .pipe(
        catchError((error) => {
          let detail =
            error.error && typeof error.error === 'object'
              ? JSON.stringify(error.error)
              : error.error || error.message;
          this.showGeneralFormError(
            `Failed to update price: ${
              error.statusText || 'Unknown error'
            }. ${detail}`
          );
          this.isSubmitting = false;
          return throwError(() => error);
        })
      )
      .subscribe({
        next: () => {
          this.showGeneralFormSuccess(
            `Price for "${this.productForPriceEdit?.name}" updated successfully.`
          );
          this.isSubmitting = false;
          this.closeEditPriceModal();
          this.fetchData(); // Reload products data
        },
        error: () => {
          this.isSubmitting = false;
        },
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

  dismissWelcomeMessage(): void {
    this.isFirstTimeUser = false;
  }
}

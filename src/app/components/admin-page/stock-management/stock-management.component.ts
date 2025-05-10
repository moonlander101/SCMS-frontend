import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  ProductService,
  Product,
} from '../../../service/admin/product.service';
import {
  SupplierRankService,
  SupplierRanking,
  SupplierRankingsResponse,
  SupplierAssignmentRequest,
} from '../../../service/admin/supplier-rank.service';
import {
  WarehouseService,
  Warehouse,
} from '../../../service/admin/warehouse.service';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.css',
})
export class StockManagementComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  supplierRankings: SupplierRankingsResponse | null = null;
  warehouses: Warehouse[] = [];
  selectedSupplier: SupplierRanking | null = null;

  // Form fields for supplier assignment
  orderQuantity: number = 0;
  selectedWarehouseId: number | null = null;
  expectedDeliveryDate: string = '';

  // Loading and error states
  isLoadingProducts: boolean = false;
  isLoadingSuppliers: boolean = false;
  isLoadingWarehouses: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private supplierRankService: SupplierRankService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadWarehouses();

    // Set default expected delivery date (7 days from now)
    const date = new Date();
    date.setDate(date.getDate() + 7);
    this.expectedDeliveryDate = date.toISOString().split('T')[0];
  }

  loadProducts(): void {
    this.isLoadingProducts = true;
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
        this.isLoadingProducts = false;
      },
      (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again.';
        this.isLoadingProducts = false;
      }
    );
  }

  loadWarehouses(): void {
    this.isLoadingWarehouses = true;
    this.warehouseService.getWarehouses().subscribe(
      (warehouses) => {
        this.warehouses = warehouses;
        this.isLoadingWarehouses = false;
      },
      (error) => {
        console.error('Error loading warehouses:', error);
        this.errorMessage = 'Failed to load warehouses. Please try again.';
        this.isLoadingWarehouses = false;
      }
    );
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.selectedSupplier = null;
    this.loadSupplierRankings(product.id);
  }

  loadSupplierRankings(productId: number): void {
    this.isLoadingSuppliers = true;
    this.supplierRankings = null;
    this.supplierRankService.getSupplierRankings(productId).subscribe(
      (rankings) => {
        this.supplierRankings = rankings;
        this.isLoadingSuppliers = false;
      },
      (error) => {
        console.error('Error loading supplier rankings:', error);
        this.errorMessage =
          'Failed to load supplier rankings. Please try again.';
        this.isLoadingSuppliers = false;
      }
    );
  }

  selectSupplier(supplier: SupplierRanking): void {
    this.selectedSupplier = supplier;
    this.errorMessage = null;
    this.successMessage = null;
  }

  getCategoryName(categoryId: number): string {
    return this.productService.getCategoryName(categoryId);
  }

  formatPrice(price: string): string {
    return parseFloat(price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'LKR',
    });
  }

  formatCapacity(capacity: string): string {
    return parseFloat(capacity).toLocaleString('en-US') + ' units';
  }

  submitAssignment(): void {
    if (
      !this.selectedProduct ||
      !this.selectedSupplier ||
      !this.selectedWarehouseId ||
      !this.orderQuantity
    ) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.orderQuantity <= 0) {
      this.errorMessage = 'Quantity must be greater than zero';
      return;
    }

    if (!this.expectedDeliveryDate) {
      this.errorMessage = 'Please select an expected delivery date';
      return;
    }

    const request: SupplierAssignmentRequest = {
      supplier_id: this.selectedSupplier.supplier_id,
      created_at: new Date().toISOString(),
      expected_delivery_date: new Date(this.expectedDeliveryDate).toISOString(),
      product_id: this.selectedProduct.id,
      count: this.orderQuantity,
      status: 'pending',
      warehouse_id: this.selectedWarehouseId,
    };

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.supplierRankService.assignSupplier(request).subscribe(
      (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Supplier assignment created successfully!';

        // Reset form
        this.orderQuantity = 0;
        this.selectedWarehouseId = null;
        this.selectedSupplier = null;

        // Set new expected delivery date (7 days from now)
        const date = new Date();
        date.setDate(date.getDate() + 7);
        this.expectedDeliveryDate = date.toISOString().split('T')[0];
      },
      (error) => {
        console.error('Error assigning supplier:', error);
        this.errorMessage = 'Failed to assign supplier. Please try again.';
        this.isSubmitting = false;
      }
    );
  }

  resetSelection(): void {
    this.selectedProduct = null;
    this.selectedSupplier = null;
    this.supplierRankings = null;
    this.orderQuantity = 0;
    this.selectedWarehouseId = null;
    this.errorMessage = null;
    this.successMessage = null;
  }
}

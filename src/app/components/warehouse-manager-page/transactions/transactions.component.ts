import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TransactionService,
  Transaction,
} from '../../../service/warehouse/transaction.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [TransactionService],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  filterType = 'ALL';
  warehouseId: number | null = null;

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get warehouse ID from route if available
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.warehouseId = +id;
      } else {
        // If not in route, try to get it from the token
        this.warehouseId = this.getWarehouseIdFromToken();
      }

      if (!this.warehouseId) {
        this.error =
          'No warehouse ID available. Please check your permissions.';
        this.loading = false;
        return;
      }

      this.loadTransactions();
    });
  }

  loadTransactions(): void {
    if (!this.warehouseId) {
      this.error = 'No warehouse ID available. Cannot load transactions.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = '';

    this.transactionService
      .getWarehouseTransactions(this.warehouseId)
      .subscribe({
        next: (data) => {
          this.transactions = data;
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load transactions. Please try again.';
          this.loading = false;
          console.error('Error loading transactions:', error);
        },
      });
  }

  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter((transaction) => {
      // Apply type filter
      if (
        this.filterType !== 'ALL' &&
        transaction.transaction_type !== this.filterType
      ) {
        return false;
      }

      // Apply search filter
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        return (
          transaction.reference_number.toLowerCase().includes(term) ||
          transaction.notes.toLowerCase().includes(term) ||
          transaction.created_by.toLowerCase().includes(term)
        );
      }

      return true;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private getWarehouseIdFromToken(): number | null {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.warn('No authentication token found');
        return null;
      }

      const decodedToken: any = jwtDecode(token);
      console.log('Decoded token:', decodedToken);

      if (!decodedToken || !decodedToken.warehouse_id) {
        console.warn('Token does not contain warehouse_id');
        return null;
      }

      return decodedToken.warehouse_id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

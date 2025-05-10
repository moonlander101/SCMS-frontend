import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TransactionService,
  Transaction,
} from '../../../service/warehouse/transaction.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  warehouseId = 1; // Default warehouse ID
  searchTerm = '';
  filterType = 'ALL';

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
      }
      this.loadTransactions();
    });
  }

  loadTransactions(): void {
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
}

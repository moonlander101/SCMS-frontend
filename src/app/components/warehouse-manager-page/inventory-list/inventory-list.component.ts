import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InventoryService } from '../../../service/warehouse/inventory.service';

interface InventoryProductDetail {
  product_name: string;
  category: string; // Updated from category_name
  supplied_by: string;
  supplied_date: string;
  product_count: number;
}

interface WarehouseInventory {
  warehouse_city: string;
  warehouse_capacity: number; // Updated from minimum_stock_level
  last_restocked: string;
  current_stock_level: number;
  inventory_product_details: InventoryProductDetail[];
}

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [InventoryService],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.css',
})
export class InventoryListComponent implements OnInit {
  warehouseId = 1;
  inventory: WarehouseInventory | null = null;
  loading = true;
  error: string | null = null;

  // Sorting properties
  sortColumn: keyof InventoryProductDetail = 'product_name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Chart data
  chartData: {
    category: string;
    count: number;
    percentage: number;
    color: string;
    startAngle: number;
    endAngle: number;
  }[] = [];

  // Pie chart gradient
  pieChartGradient = '';

  // Hover state
  hoverCategory: {
    category: string;
    count: number;
    percentage: number;
    color: string;
  } | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.fetchInventory();
  }

  fetchInventory(): void {
    this.loading = true;
    this.inventoryService.getWarehouseInventory(this.warehouseId).subscribe({
      next: (data) => {
        this.inventory = data;
        this.loading = false;
        this.prepareChartData();
      },
      error: (err) => {
        this.error = 'Failed to load inventory data';
        this.loading = false;
        console.error('Error fetching inventory:', err);
      },
    });
  }

  // Get total count for center of chart
  getTotalCount(): number {
    if (!this.inventory) return 0;
    return this.inventory.current_stock_level;
  }

  getStockLevelPercentage(): number {
    if (!this.inventory) return 0;
    return (
      (this.inventory.current_stock_level / this.inventory.warehouse_capacity) * // Updated from minimum_stock_level
      100
    );
  }

  getStockLevelClass(): string {
    const percentage = this.getStockLevelPercentage();
    if (percentage < 30) return 'low-stock';
    if (percentage < 70) return 'medium-stock';
    return 'good-stock';
  }

  // Hover handlers for pie chart
  onSegmentHover(item: any): void {
    this.hoverCategory = item;
  }

  onSegmentLeave(): void {
    this.hoverCategory = null;
  }

  // Sort functionality
  sort(column: keyof InventoryProductDetail): void {
    if (this.sortColumn === column) {
      // Toggle direction if same column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    if (this.inventory) {
      this.inventory.inventory_product_details.sort((a, b) => {
        const valueA = a[this.sortColumn];
        const valueB = b[this.sortColumn];

        let comparison = 0;
        if (valueA < valueB) {
          comparison = -1;
        } else if (valueA > valueB) {
          comparison = 1;
        }

        return this.sortDirection === 'desc' ? comparison * -1 : comparison;
      });
    }
  }

  // Get sort icon class
  getSortIconClass(column: keyof InventoryProductDetail): string {
    if (this.sortColumn !== column) return 'sort-icon';
    return this.sortDirection === 'asc'
      ? 'sort-icon sort-asc'
      : 'sort-icon sort-desc';
  }

  // Get color for a specific category
  getCategoryColor(category: string): string {
    const foundItem = this.chartData.find((item) => item.category === category);
    return foundItem ? foundItem.color : '#ccc';
  }

  // Prepare chart data
  prepareChartData(): void {
    if (!this.inventory) return;

    // Group by category and sum product counts
    const categoryMap = new Map<string, number>();

    this.inventory.inventory_product_details.forEach((item) => {
      const currentCount = categoryMap.get(item.category) || 0; // Updated from category_name
      categoryMap.set(item.category, currentCount + item.product_count); // Updated from category_name
    });

    // Calculate total for percentages
    const totalCount = Array.from(categoryMap.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    // Modern color palette
    const colors = [
      '#3366cc',
      '#dc3912',
      '#ff9900',
      '#109618',
      '#990099',
      '#0099c6',
      '#dd4477',
      '#66aa00',
      '#b82e2e',
      '#316395',
      '#994499',
      '#22aa99',
    ];

    // Calculate angles for pie segments
    let currentAngle = 0;

    this.chartData = Array.from(categoryMap.entries()).map(
      ([category, count], index) => {
        const percentage = (count / totalCount) * 100;
        const startAngle = currentAngle;
        const endAngle = startAngle + percentage * 3.6; // Convert to degrees (360/100)

        currentAngle = endAngle;

        return {
          category,
          count,
          percentage,
          color: colors[index % colors.length],
          startAngle,
          endAngle,
        };
      }
    );

    // Generate CSS conic gradient string
    this.generatePieChartGradient();
  }

  // Generate CSS conic gradient for pie chart
  generatePieChartGradient(): void {
    const gradientStops = this.chartData
      .map((item) => `${item.color} ${item.startAngle}deg ${item.endAngle}deg`)
      .join(', ');

    this.pieChartGradient = `conic-gradient(${gradientStops})`;
  }
}

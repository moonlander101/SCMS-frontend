import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

// Import needed Chart.js register plugins INCLUDING PieController and LineController
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  PieController,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Register the required Chart.js components
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  PieController,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

@Component({
  standalone: true,
  selector: 'app-forecast',
  imports: [CommonModule, FormsModule, HttpClientModule, BaseChartDirective],
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent {
  productSKU = '';
  days = 30;
  forecastResult: any = null;
  isLoading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  // Pie Chart Configuration
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: ['Current Stock', 'Stock Shortfall'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#4BB3FF', '#FF7D9D'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Line Chart Configuration
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Predicted Demand',
        borderColor: '#5C6BC0',
        backgroundColor: 'rgba(92, 107, 192, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3949AB',
        pointBorderColor: '#FFF',
        pointHoverBackgroundColor: '#FFF',
        pointHoverBorderColor: '#3949AB',
        pointRadius: 4,
      },
      {
        data: [],
        label: 'Lower Bound',
        borderColor: '#66BB6A',
        backgroundColor: 'rgba(102, 187, 106, 0.1)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 2,
      },
      {
        data: [],
        label: 'Upper Bound',
        borderColor: '#FFA726',
        backgroundColor: 'rgba(255, 167, 38, 0.1)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
    },
  };

  updateCharts(res: any) {
    // Update pie chart
    this.pieChartData.datasets[0].data = [
      res.current_stock,
      res.stock_shortfall,
    ];

    // Update line chart
    const dates = res.daily_predictions.map((d: any) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    });

    const predicted = res.daily_predictions.map((d: any) => d.predicted);
    const lowerBound = res.daily_predictions.map((d: any) => d.lower_bound);
    const upperBound = res.daily_predictions.map((d: any) => d.upper_bound);

    this.lineChartData.labels = dates;
    this.lineChartData.datasets[0].data = predicted;
    this.lineChartData.datasets[1].data = lowerBound;
    this.lineChartData.datasets[2].data = upperBound;
  }

  getForecast() {
    this.isLoading = true;
    this.error = null;
    this.forecastResult = null;

    const body = {
      product_SKU: this.productSKU,
      days: this.days,
    };

    this.http.post('http://localhost:8000/api/forecast/', body).subscribe({
      next: (res: any) => {
        console.log('Forecast API response:', res);
        this.forecastResult = res;
        this.isLoading = false;
        this.updateCharts(res);
      },
      error: (err) => {
        this.error =
          err.error?.error || err.message || 'An unknown error occurred';
        this.isLoading = false;
        console.error('Forecast API error:', err);
      },
    });
  }
}

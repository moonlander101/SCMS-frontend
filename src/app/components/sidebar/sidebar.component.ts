import { Component, input, InputSignal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode';

interface Tab {
  label: string;
  route: string;
  // icon: SafeHtml;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  // based on Auth have to implement which routes to use
  constructor(private sanitizer: DomSanitizer, private router: Router) {}
  tabs: Tab[] = [];
  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const roleId = decodedToken?.role_id;
        this.tabs = this.roleTabs[roleId] || [];
      } catch (error) {
        console.error('Invalid token:', error);
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  // ADD NEW ROUTES TO THIS OBJECT AS FOLLOWS
  // 1 - ADMIN ROUTES
  // 4 - VENDOR ROUTES
  // 6 - DRIVER ROUTES
  roleTabs: { [key: number]: Tab[] } = {
    5: [
      // Warehouse Manager
      { label: 'Inventory', route: '/dashboard/warehouse/inventory' },
      { label: 'Transactions', route: '/dashboard/warehouse/transactions' },
      {
        label: 'Supplier Requests',
        route: '/dashboard/warehouse/supplier-requests',
      },
      { label: 'Vendor Orders', route: '/dashboard/warehouse/vendor-orders' },
      { label: 'Truck Tracking', route: '/dashboard/warehouse/truck-tracking' },
      { label: 'Add Trucks', route: '/dashboard/warehouse/truck-add' },
      { label: 'Profile', route: '/dashboard/profile' },
    ],
    3: [
      // Supplier
      { label: 'Product Management', route: '/dashboard/supplier/product-management' },
      { label: 'Inventory', route: '/dashboard/supplier/inventory' },
      { label: 'Current Order Requests & History', route: '/dashboard/supplier/current-requests' },
      { label: 'Profile', route: '/dashboard/supplier/profile' },
    ],

    6: [
      // Driver
      { label: 'Current Assignment', route: '/dashboard/driver/current' },
      { label: 'Profile', route: '/dashboard/driver/profile' },
    ],

    1: [
      // Admin
      { label: 'Warehouses', route: '/dashboard/admin/warehouse' },
      { label: 'Demand Forecast', route: '/dashboard/admin/forecast' },
      { label: 'Stock Management', route: '/dashboard/admin/stock-manage' },
      { label: 'Registrations', route: '/dashboard/admin/register' },
      { label: 'Driver Management', route: '/dashboard/admin/truck-assign' },
      { label: 'Profile', route: '/dashboard/profile' },
    ],

    4: [
      // Vendor
      { label: 'Product Catalog', route: '/dashboard/vendor/product-section' },
      { label: 'Your Cart', route: '/dashboard/vendor/cart-summary' },
      { label: 'Order History', route: '/dashboard/vendor/order-history' },
      { label: 'Profile', route: '/dashboard/profile' },
    ],
  };

  isClosed = input<boolean>(false);

  logout(): void {
    // Add a small delay to show the loading animation
    setTimeout(() => {
      // Remove token from localStorage
      localStorage.removeItem('token');

      // You might also want to clear any other auth-related data
      localStorage.removeItem('user');

      // Redirect to login page
      this.router.navigate(['/auth']);
    }, 800); // 800ms delay for visual feedback
  }
}

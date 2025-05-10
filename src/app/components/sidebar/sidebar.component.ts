import { Component, input, InputSignal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode'


interface Tab {
  label: string;
  route: string;
  // icon: SafeHtml;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  // based on Auth have to implement which routes to use
  constructor(private sanitizer: DomSanitizer, private router: Router) {

  }
  tabs : Tab[] = [];
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
    5: [ // Warehouse Manager
      { label: 'Inventory', route: '/dashboard/warehouse/inventory' },
      { label: 'Transactions', route: '/dashboard/warehouse/transactions' },
      { label: 'Supplier Requests', route: '/dashboard/warehouse/supplier-requests' },
      { label: 'Vendor Orders', route: '/dashboard/warehouse/vendor-orders' },
      { label: 'Truck Tracking', route: '/dashboard/warehouse/truck-tracking' },
      { label: 'Profile', route: '/dashboard/profile' },
    ],
    3: [ // Supplier
      { label: 'Order History', route: '/dashboard/supplier/order-history' },
      { label: 'Inventory', route: '/dashboard/supplier/inventory' },
      { label: 'Product Management', route: '/dashboard/supplier/product-management' },
      { label: 'Current Requests', route: '/dashboard/supplier/current-requests' },
      { label: 'Supplier Dashboard', route: '/dashboard/supplier/supplier' },
      { label: 'Profile', route: '/dashboard/supplier/profile' },
    ],

    6: [ // Driver
      { label: 'Profile', route: '/dashboard/driver/profile'},
      { label: 'Current Assignment', route: '/dashboard/driver/current'}
    ],

    1: [ // Admin
      { label: 'Warehouses', route: '/dashboard/admin/warehouse' },
      { label: 'Demand Forecast', route: '/dashboard/admin/forecast' },
      { label: 'Stock Management', route: '/dashboard/admin/stock-manage' },
      { label: 'Registrations', route: '/dashboard/admin/register' },
      { label: 'Profile', route: '/dashboard/profile' },
    ],

  };

  // tabs: Tab[] = [
  //   {
  //     label: 'Profile',
  //     route: 'profile',
  //     // icon: this.sanitize(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  //     //       d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />`)
  //   },
  //   {
  //     label: 'Forecast',
  //     route: 'forecast',
  //     // icon: this.sanitize(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  //     //       d="M3 10h4l3 7h4l3-7h4M3 6h18M3 6l1.5 4m0 0L6 10m12-4l1.5 4m0 0L18 10" />`)
  //   },
  //   // {
  //   //   label: 'Supplier',
  //   //   route: '/supplier',
  //   //   // icon: this.sanitize(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  //   //   //       d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`)
  //   // },
  //   {
  //     label: 'Orders',
  //     route: '/orders',
  //     // icon: this.sanitize(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  //     //       d="M16 8v4a4 4 0 01-8 0V8m8-2H8a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2z" />`)
  //   },
  //   {
  //     label: 'Inventory',
  //     route: '/inventory',
  //     // icon: this.sanitize(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  //     //       d="M3 7v10a1 1 0 001 1h14a1 1 0 001-1V7m-6-4h6a1 1 0 011 1v3m-8-4H5a1 1 0 00-1 1v3m6-4v12" />`)
  //   },
  //   {
  //     label: 'Deliveries',
  //     route: '/deliveries',
  //     // icon: this.sanitize(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  //     //       d="M16.5,9.5 L21,14 L16.5,18.5 M21,14 L11,14 M21,14 L16.5,9.5 M11,14 L11,9.5 M11,14 L6.5,18.5 M11,14 L6.5,9.5 M11,14 L11,9.5 M11,14 L
  //   },
  //   {
  //     label: 'Contact',
  //     route: '/contact',
  //     // icon: this.sanitize(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
  //     //       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`)
  //   },
  //   {
  //     label: 'Warehouse-Inventory',
  //     route: '/dashboard/warehouse',
  //   },
  //   {
  //     label: 'Warehouse-Truck Tracking',
  //     route: '/dashboard/warehouse/truck-tracking',
  //   },
  //   {
  //     label: 'Warehouse-Vendor Orders',
  //     route: '/dashboard/warehouse/vendor-orders',
  //   },
  //   {
  //     label: 'Warehouse-Supplier Requests',
  //     route: '/dashboard/warehouse/supplier-requests',
  //   }
  // ];

  isClosed = input<boolean>(false);
}

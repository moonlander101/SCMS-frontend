import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  tabs: Tab[] = [
    {
      label: 'Profile',
      route: 'profile',
      // icon: this.sanitize(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      //       d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />`)
    },
    {
      label: 'Product Managment',
      route: '/dashboard/supplier/product-management',
    },
    {
      label: 'Inventory Managment',
      route: '/dashboard/supplier/inventory',
    },
    {
      label: 'Current Requests',
      route: '/dashboard/supplier/current-requests',
    },
  ];
  isClosed = input<boolean>(false);
}

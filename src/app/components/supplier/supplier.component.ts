import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Tab {
  label: string;
  route: string;
  // icon: SafeHtml;
}

@Component({
  selector: 'app-supplier',
  imports: [RouterLink],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierDashboard {
  user = {
    name: "John Smith",
    role: "Warehouse Manager",
    employeeId: "LM-2023-089",
    department: "Logistics",
    location: "North Distribution Center",
    reportsTo: "Operations Director",
    email: "john.smith@company.com",
    workPhone: "(555) 123-4567",
    extension: "4589",
  }
  tabs: Tab[] = [
    {
      label: 'inventory',
      route: 'inventory',
    },
    {
      label: 'order-history',
      route: 'order-history',
    },
    {
      label: 'Contact',
      route: '/contact',
      // icon: this.sanitize(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      //       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`)
    }
  ];;
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
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
}

import { Component, OnInit } from '@angular/core';
import {
  ProfileService,
  UserResponse,
} from '../../service/profile/profile.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [ProfileService],
})
export class ProfileComponent implements OnInit {
  user: any = {
    name: '',
    role: '',
    employeeId: '',
    department: '',
    location: '',
    email: '',
    workPhone: '',
    extension: '',
  };

  roleSpecificDetails: { label: string; value: string }[] = [];
  contactDetails: { label: string; value: string }[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.profileService.getProfileData().subscribe({
      next: (response: UserResponse) => {
        if (response.success) {
          this.mapUserData(response.user);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          'Failed to load profile data. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching profile:', error);
      },
    });
  }

  mapUserData(userData: any): void {
    // Map common user data
    this.user.name = `${userData.first_name} ${userData.last_name}`;
    this.user.role = userData.role;
    this.user.email = userData.email;
    this.user.workPhone = userData.phone || 'Not provided';

    // Default to username as employee ID if not specified
    this.user.employeeId = userData.username;

    // Create contact details array
    this.contactDetails = [
      { label: 'Email', value: userData.email },
      { label: 'Phone', value: userData.phone || 'Not provided' },
      { label: 'Username', value: userData.username },
    ];

    // Role-specific processing
    switch (userData.role) {
      case 'Warehouse Manager':
        this.handleWarehouseManager(userData);
        break;
      case 'Driver':
        this.handleDriver(userData);
        break;
      case 'Admin':
        this.handleAdmin(userData);
        break;
      case 'Supplier':
        this.handleSupplier(userData);
        break;
      case 'Vendor':
        this.handleVendor(userData);
        break;
      default:
        // Default case for unknown roles
        this.roleSpecificDetails = [
          { label: 'User ID', value: userData.user_id.toString() },
          { label: 'Role', value: userData.role },
        ];
    }
  }

  handleWarehouseManager(userData: any): void {
    const roleData = userData.role_data || {};
    this.user.department = roleData.department || 'Main Department';
    this.user.location = `Warehouse #${roleData.warehouse_id || 'Unassigned'}`;

    this.roleSpecificDetails = [
      { label: 'Employee ID', value: userData.username },
      { label: 'Department', value: roleData.department || 'Main Department' },
      { label: 'Role', value: userData.role },
      { label: 'Warehouse ID', value: roleData.warehouse_id || 'Unassigned' },
    ];
  }

  handleDriver(userData: any): void {
    const roleData = userData.role_data || {};

    this.roleSpecificDetails = [
      { label: 'Employee ID', value: userData.username },
      { label: 'Role', value: userData.role },
      {
        label: 'License Number',
        value: roleData.license_number || 'Not provided',
      },
      { label: 'Vehicle Type', value: roleData.vehicle_type || 'Not assigned' },
      { label: 'Vehicle ID', value: roleData.vehicle_id || 'Not assigned' },
    ];
  }

  handleAdmin(userData: any): void {
    this.roleSpecificDetails = [
      { label: 'Employee ID', value: userData.username },
      { label: 'Role', value: userData.role },
      { label: 'Access Level', value: 'System Administrator' },
      { label: 'Department', value: 'Administration' },
    ];
  }

  handleSupplier(userData: any): void {
    const roleData = userData.role_data || {};

    this.roleSpecificDetails = [
      { label: 'Supplier Code', value: roleData.code || 'Not assigned' },
      { label: 'Company Name', value: roleData.company_name || 'Not provided' },
      {
        label: 'Business Type',
        value: roleData.business_type || 'Not specified',
      },
      {
        label: 'Compliance Score',
        value: roleData.compliance_score?.toString() || 'Not rated',
      },
      { label: 'Tax ID', value: roleData.tax_id || 'Not provided' },
    ];

    // Add address to contact details
    if (roleData.street_no || roleData.street_name || roleData.city) {
      const address = [
        roleData.street_no,
        roleData.street_name,
        roleData.city,
        roleData.zipcode,
      ]
        .filter(Boolean)
        .join(', ');

      this.contactDetails.push({ label: 'Address', value: address });
    }
  }

  handleVendor(userData: any): void {
    const roleData = userData.role_data || {};

    this.roleSpecificDetails = [
      { label: 'Shop Name', value: roleData.shop_name || 'Not provided' },
      {
        label: 'Business License',
        value: roleData.business_license || 'Not provided',
      },
      { label: 'Role', value: userData.role },
    ];

    // Add location to contact details
    if (roleData.location) {
      this.contactDetails.push({ label: 'Location', value: roleData.location });
    }
  }
  isLoggingOut = false;

  // Update your logout method
  logout(): void {
    this.isLoggingOut = true;

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

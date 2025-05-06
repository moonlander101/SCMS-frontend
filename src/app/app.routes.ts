import { Routes } from '@angular/router';
import { LoginSignupComponent } from './components/auth-page/login-signup/login-signup.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SupplierDashboard } from './components/supplier-page/supplier/supplier.component';
import { InventoryComponent } from './components/supplier-page/inventory/inventory.component';
import { OrderHistoryComponent } from './components/supplier-page/order-history/order-history.component';
import { ProductManagementComponent } from './components/supplier-page/product-management/product-management.component';
import { CurrentRequestsComponent } from './components/supplier-page/current-requests/current-requests.component';
import { ForecastComponent } from './components/admin-page/forecast/forecast.component';

import { authGuard } from './gaurds/auth.guard'
import { roleGuard } from './gaurds/role.guard';
import { VendorSignupComponent } from './components/auth-page/vendor-signup/vendor-signup.component';
import { SupplierSignupComponent } from './components/auth-page/supplier-signup/supplier-signup.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [{ path: '', redirectTo: 'home', pathMatch: 'full' }],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'vendor', component: VendorSignupComponent },
      { path: 'supplier', component: SupplierSignupComponent },
      { path: '', component: LoginSignupComponent },

    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: ProfileComponent, pathMatch: 'full' }, // /dashboard
      { path: 'profile', component: ProfileComponent, pathMatch: 'full' },
      {
        path: 'forecast',
        component: ForecastComponent,
        pathMatch: 'full',
      },
      { path: 'order-history', component: OrderHistoryComponent },   // /dashboard/orders
      { path: 'inventory', component: InventoryComponent }, // /dashboard/inventory
      { path: 'product-management', component: ProductManagementComponent}, // /dashboard/product-management
      { path: 'current-requests', component: CurrentRequestsComponent }, // /dashboard/current-requests
      // { path: 'deliveries', component: DeliveriesComponent }, // /dashboard/deliveries
      // { path: 'vendors', component: VendorsComponent },
      { path: 'supplier', component: SupplierDashboard, pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'home' }, // Handle 404/unknown routes
];

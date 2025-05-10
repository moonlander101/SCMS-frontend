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

import { authGuard } from './gaurds/auth.guard';
import { roleGuard } from './gaurds/role.guard';
import { VendorSignupComponent } from './components/auth-page/vendor-signup/vendor-signup.component';
import { SupplierSignupComponent } from './components/auth-page/supplier-signup/supplier-signup.component';
import { InventoryListComponent } from './components/warehouse-manager-page/inventory-list/inventory-list.component';
import { SupplierReqComponent } from './components/warehouse-manager-page/supplier-req/supplier-req.component';
import { TransactionsComponent } from './components/warehouse-manager-page/transactions/transactions.component';
import { TruckTrackingComponent } from './components/warehouse-manager-page/truck-tracking/truck-tracking.component';
import { VendorOrdersComponent } from './components/warehouse-manager-page/vendor-orders/vendor-orders.component';
import { SupplierReqSurveyComponent } from './components/warehouse-manager-page/supplier-req-survey/supplier-req-survey.component';
import { DeliveryTableComponent } from './components/driver-page/current-delivery/delivery-table.component';
import { DriverManagerRegisterComponent } from './components/admin-page/driver-manager-register/driver-manager-register.component';
import { WarehouseComponent } from './components/admin-page/warehouse/warehouse.component';
import { StockManagementComponent } from './components/admin-page/stock-management/stock-management.component';


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
      { path: '', redirectTo: 'profile', pathMatch: 'full' }, // /dashboard
      { path: 'profile', component: ProfileComponent, pathMatch: 'full' },
      // Warehouse Manager routes
      {
        path: 'warehouse',
        canActivate: [roleGuard(5)],
        data: { roles: ['warehouse-manager'] },
        children: [
          { path: '', redirectTo: 'inventory', pathMatch: 'full' },
          { path: 'inventory', component: InventoryListComponent },
          { path: 'transactions', component: TransactionsComponent },
          { path: 'supplier-requests', component: SupplierReqComponent },
          { path: 'vendor-orders', component: VendorOrdersComponent },
          { path: 'truck-tracking', component: TruckTrackingComponent },
          {
            path: 'supplier-request-survey/:id',
            component: SupplierReqSurveyComponent,
          },
          { path: 'profile', component: ProfileComponent },
          { path: '**', redirectTo: '', pathMatch: 'full' },
        ],
      },
      // Admin Routes
      {
        path: 'admin',
        canActivate: [roleGuard(1)],
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },

          { path: 'profile', component: ProfileComponent, pathMatch: 'full' },
          {
            path: 'warehouse',
            component: WarehouseComponent,
            pathMatch: 'full',
          },
          {
            path: 'forecast',
            component: ForecastComponent,
            pathMatch: 'full',
          },
          { path: 'register', component: DriverManagerRegisterComponent },
          { path: 'stock-manage', component: StockManagementComponent },
          // rest (modify sidebar.ts as well)
          { path: '**', redirectTo: '', pathMatch: 'full' },
        ],
      },
      // Supplier Routes
      {
        path: 'supplier',
        canActivate: [roleGuard(3)],
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'order-history', component: OrderHistoryComponent },
          { path: 'inventory', component: InventoryComponent },
          { path: 'product-management', component: ProductManagementComponent },
          { path: 'current-requests', component: CurrentRequestsComponent },
          // { path: 'deliveries', component: DeliveriesComponent },
          // { path: 'vendors', component: VendorsComponent },
          { path: 'supplier', component: SupplierDashboard, pathMatch: 'full' },
          { path: 'profile', component: ProfileComponent },
          { path: '**', redirectTo: '', pathMatch: 'full' },
        ],
      },
      {
        path: 'vendor',
        canActivate: [roleGuard(4)],
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          // rest... (modify sidebar.ts as well)
          { path: '**', redirectTo: '', pathMatch: 'full' },
        ],
      },
      // Driver Routes
      {
        path : 'driver',
        canActivate : [roleGuard(6)],
        children : [
          { path : '', redirectTo: 'profile', pathMatch: 'full'},
          { path  : 'profile', component: ProfileComponent},
          // rest... (modify sidebar.ts as well)
          { path : 'current', component: DeliveryTableComponent },
          { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
      },
    ],
  },
  { path: '**', redirectTo: 'home' }, // Handle 404/unknown routes
];

import { Routes } from '@angular/router';
import { LoginSignupComponent } from './components/auth/login-signup/login-signup.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SupplierComponent } from './components/supplier/supplier.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      // Additional routes for your main layout
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'auth', component: LoginSignupComponent }
      // You can add more auth-related routes if needed:
      // { path: 'forgot-password', component: ForgotPasswordComponent },
      // { path: 'reset-password', component: ResetPasswordComponent }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileComponent, pathMatch: 'full' }, // /dashboard
      { path: 'profile', component: ProfileComponent, pathMatch: 'full' },
      // { path: 'orders', component: OrdersComponent },   // /dashboard/orders
      // { path: 'inventory', component: InventoryComponent }, // /dashboard/inventory
      // { path: 'deliveries', component: DeliveriesComponent }, // /dashboard/deliveries
      // { path: 'vendors', component: VendorsComponent },
      { path: 'supplier', component: SupplierComponent }
    ]
  },
  { path: '**', redirectTo: 'home' } // Handle 404/unknown routes
];

import { Routes } from '@angular/router';
import { LoginSignupComponent } from './components/auth/login-signup/login-signup.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { ForecastComponent } from './components/forecast/forecast.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [{ path: '', redirectTo: 'home', pathMatch: 'full' }],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [{ path: 'auth', component: LoginSignupComponent }],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileComponent, pathMatch: 'full' }, // /dashboard
      { path: 'profile', component: ProfileComponent, pathMatch: 'full' },
      {
        path: 'forecast',
        component: ForecastComponent,
        pathMatch: 'full',
      },
      { path: 'supplier', component: SupplierComponent },
    ],
  },
  { path: '**', redirectTo: 'home' }, // Handle 404/unknown routes
];

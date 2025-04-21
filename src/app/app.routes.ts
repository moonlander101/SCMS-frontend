import { Routes } from '@angular/router';
import { LoginSignupComponent } from './components/auth/login-signup/login-signup.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

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
  { path: '**', redirectTo: 'home' } // Handle 404/unknown routes
];
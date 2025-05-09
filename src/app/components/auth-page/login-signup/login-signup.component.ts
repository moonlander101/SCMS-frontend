import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../service/auth/login.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  providers: [LoginService],
})
export class LoginSignupComponent implements OnInit, AfterViewInit {
  signInForm: FormGroup;
  signUpForm: FormGroup;
  isSignUpMode = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const container = document.querySelector('.auth-container');
      if (container) {
        container.classList.add('animate-in');
      }
    }, 0);
  }

  toggleSignUpMode(): void {
    this.isSignUpMode = true;
    document.querySelector('.auth-container')?.classList.add('sign-up-mode');
  }

  toggleSignInMode(): void {
    this.isSignUpMode = false;
    document.querySelector('.auth-container')?.classList.remove('sign-up-mode');
  }

  onSignIn(): void {
    if (this.signInForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = {
        username: this.signInForm.value.username,
        password: this.signInForm.value.password,
      };

      this.loginService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/dashboard/profile']);
          // Get user role and navigate accordingly
          // const user = this.loginService.getCurrentUser();
          // if (user) {
          //   // Navigate based on user role
          //   switch (user.role) {
          //     case 'Admin':
          //       this.router.navigate(['/dashboard/profile']);
          //       break;
          //     case 'Vendor':
          //       this.router.navigate(['/dashboard/profile']);
          //       break;
          //     case 'Supplier':
          //       this.router.navigate(['/dashboard/profile']);
          //       break;
          //     case 'Warehouse_Manager':
          //       this.router.navigate(['/dashboard/profile']);
          //       break;
          //     default:
          //       this.router.navigate(['/dashboard/profile']);
          //   }
          // } else {
          //   this.router.navigate(['/dashboard/profile']);
          // }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage =
            error.error?.message || 'Login failed. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  onSignUp(): void {
    if (this.signUpForm.valid) {
      console.log('Sign Up Form submitted', this.signUpForm.value);
    }
  }
}

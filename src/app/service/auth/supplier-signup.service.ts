import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface SupplierSignupRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company_name: string;
  street_no: string;
  street_name: string;
  city: string;
  zipcode: string;
  business_type: string;
  tax_id: string;
  phone: string;
  role_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class SupplierSignupService {
  private baseUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  registerSupplier(supplierData: SupplierSignupRequest): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/register/supplier/`, supplierData)
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError(this.handleError)
      );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response) => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Handles authentication response by storing token and user in localStorage
   */
  private handleAuthResponse(response: any): void {
    if (response && response.token) {
      // Store the token
      localStorage.setItem('token', response.token);

      // Store the user object as a JSON string
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
  }

  /**
   * Get the current user from localStorage
   */
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Logout user by clearing localStorage
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      // Add more specific error handling if the backend returns detailed errors
      if (error.error && typeof error.error === 'object') {
        const serverErrors = Object.values(error.error).flat();
        if (serverErrors.length > 0) {
          errorMessage = serverErrors.join('\n');
        }
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

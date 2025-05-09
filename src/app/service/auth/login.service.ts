import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login/`, credentials)
      .pipe(tap((response) => this.handleAuthResponse(response)));
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
}

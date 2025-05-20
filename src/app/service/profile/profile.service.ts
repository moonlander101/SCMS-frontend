import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserResponse {
  success: boolean;
  user: {
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role_id: number;
    role: string;
    is_verified: boolean;
    phone: string;
    role_data: any;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:8006/api/v1/me/';

  constructor(private http: HttpClient) {}

  getProfileData(): Observable<UserResponse> {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Create headers with authorization token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Pass headers in the request options
    return this.http.get<UserResponse>(this.apiUrl, { headers });
  }
}

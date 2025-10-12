import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'YOUR_BACKEND_API_URL';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) { }

  // Redirects the user to the GitHub authentication endpoint on the backend
  loginWithGithub() {
    window.location.href = `${this.apiUrl}/auth/github`;
  }

  // Redirects the user to the Google authentication endpoint on the backend
  loginWithGoogle() {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  // Save the token received from the backend after a successful login
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get the token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if the user is authenticated by checking for a token
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Log the user out by removing the token
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']); // Redirect to login page
  }
}

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'YOUR_BACKEND_API_URL';
  private tokenKey = 'auth_token';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    // Inject PLATFORM_ID to detect the current environment (browser vs. server)
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // Determine if the code is running in a browser (where localStorage exists)
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // All methods accessing browser-specific APIs (window/localStorage) are now guarded

  loginWithGithub() {
    if (this.isBrowser) {
      window.location.href = `${this.apiUrl}/auth/github`;
    }
  }

  loginWithGoogle() {
    if (this.isBrowser) {
      window.location.href = `${this.apiUrl}/auth/google`;
    }
  }

  setToken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isAuthenticated(): boolean {
    // Calls the browser-guarded getToken()
    return !!this.getToken();
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      this.router.navigate(['/login']);
    }
  }
}

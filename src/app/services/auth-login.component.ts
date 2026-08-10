import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, AuthState } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.css',
})
export class AuthLogin {
  authState$: Observable<AuthState>;

  errorMessage = '';
  successMessage = '';

  constructor(private readonly authService: AuthService) {
    this.authState$ = this.authService.authState$;
  }

  loginWithGithub(): void {
    this.authService.loginWithGithub();
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  loginWithOidc(): void {
    this.authService.loginWithOidc();
  }

  onLogout(): void {
    this.authService.logout();
    this.successMessage = 'Logged out successfully';

    setTimeout(() => {
      this.successMessage = '';
    }, 2000);
  }

  getTokenStatus(): { isValid: boolean; username?: string; expiresIn?: string } {
    return this.authService.getTokenStatus();
  }
}

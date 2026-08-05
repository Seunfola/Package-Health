import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService, AuthState } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.css',
})
export class AuthLogin implements OnInit {
  loginForm!: FormGroup;
  authState$: Observable<AuthState>;

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showTokenInput = false;

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
  ) {
    this.authState$ = this.authService.authState$;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * INITIALIZE FORM: Create reactive form with validation
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      token: [
        '',
        [
          Validators.required,
          Validators.minLength(40),
          Validators.pattern(/^gh[pousr]_[a-zA-Z0-9]{36}$/),
        ],
      ],
    });
  }

  /**
   * LOGIN WITH GITHUB: Trigger OAuth flow
   */
  loginWithGithub(): void {
    this.authService.loginWithGithub();
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  loginWithOidc(): void {
    this.authService.loginWithOidc();
  }

  /**
   * LOGIN: Handle login form submission
   */
  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter a valid GitHub token';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const token = this.loginForm.get('token')?.value;

      const success = await this.authService.loginWithToken(token);

      if (success) {
        this.successMessage = 'Successfully authenticated with GitHub!';
        this.loginForm.reset();
        this.showTokenInput = false;

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } else {
        this.errorMessage = 'Failed to authenticate. Check your token and try again.';
      }
    } catch (error) {
      this.errorMessage = 'An error occurred during authentication.';
      console.error('Login error:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * LOGOUT: Handle logout
   */
  onLogout(): void {
    this.authService.logout();
    this.loginForm.reset();
    this.errorMessage = '';
    this.successMessage = 'Logged out successfully';

    setTimeout(() => {
      this.successMessage = '';
    }, 2000);
  }

  /**
   * GET TOKEN STATUS: Display current auth status
   */
  getTokenStatus(): { isValid: boolean; username?: string; expiresIn?: string } {
    return this.authService.getTokenStatus();
  }

  /**
   * TOGGLE TOKEN INPUT: Show/hide token input field
   */
  toggleTokenInput(): void {
    this.showTokenInput = !this.showTokenInput;
    if (!this.showTokenInput) {
      this.loginForm.reset();
      this.errorMessage = '';
    }
  }

  /**
   * GET FORM ERROR: Return user-friendly error message
   */
  getFormError(): string {
    const tokenControl = this.loginForm.get('token');

    if (!tokenControl) return '';
    if (tokenControl.hasError('required')) return 'Token is required';
    if (tokenControl.hasError('minlength')) return 'Token too short (minimum 30 characters)';
    if (tokenControl.hasError('maxlength')) return 'Token too long (maximum 500 characters)';
    if (tokenControl.hasError('invalidTokenFormat'))
      return 'Invalid token format. Must start with ghp_, ghu_, ghs_, or ghr_';
    if (tokenControl.hasError('tokenContainsSpace')) return 'Token cannot contain spaces';

    return '';
  }

  /**
   * OPEN GITHUB TOKEN SETTINGS: Guide user to create token
   */
  openGitHubTokenSettings(): void {
    window.open('https://github.com/settings/tokens/new', '_blank');
  }
}

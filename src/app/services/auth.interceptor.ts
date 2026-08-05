import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '@/environments/environment';

/**
 * HTTP INTERCEPTOR: Securely inject GitHub token into requests
 *
 * SECURITY PRACTICES:
 * - Token added ONLY to backend API endpoints, not external URLs
 * - Token never logged or exposed in errors
 * - 401 errors trigger logout
 * - Prevents token leakage to third-party services
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only add token to backend API requests (not external URLs)
    if (this.shouldAddToken(request)) {
      const token = this.authService.getToken();

      if (token) {
        // Clone request and add Authorization header
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest', // CSRF protection
          },
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Only 401 means the token itself is invalid/expired — logging out
        // is correct there. 403 means a valid, authenticated token was
        // rejected for lacking permission on this specific resource (e.g.
        // OrgMembershipGuard, PlatformAdminGuard) — logging the user out of
        // their entire session over that would be wrong; they're still
        // validly signed in everywhere else.
        if (error.status === 401) {
          this.authService.logout();
          console.warn('Session expired. Please login again.');
        }

        // Never expose token in error messages
        const safeError = this.sanitizeError(error);
        return throwError(() => safeError);
      }),
    );
  }

  /**
   * SHOULD ADD TOKEN: Determine if token should be added to request
   * - Only add to backend API endpoints (matched directly against the
   *   consolidated environment's base URLs, not a narrow localhost/`/api/`
   *   regex — that regex missed `authUrl` requests like `GET auth/me`,
   *   which don't contain an `/api/` path segment).
   * - Skip external URLs, GitHub OAuth, etc.
   */
  private shouldAddToken(request: HttpRequest<unknown>): boolean {
    const url = request.url.toLowerCase();
    const backendBaseUrls = [environment.apiBaseUrl, environment.apiUrl, environment.authUrl].map(
      (base) => base.toLowerCase(),
    );

    // Add token only to internal API/auth endpoints
    return backendBaseUrls.some((base) => url.startsWith(base));
  }

  /**
   * SANITIZE ERROR: Remove sensitive info from error messages
   */
  private sanitizeError(error: HttpErrorResponse): HttpErrorResponse {
    // Create safe error response without exposing internal details
    const safeError = {
      ...error,
      error: typeof error.error === 'object' ? { message: error.message } : error.error,
    };

    // Don't expose full error details in production
    if (error.status === 401) {
      return new HttpErrorResponse({
        error: 'Authentication failed. Please check your token.',
        status: error.status,
        statusText: 'Unauthorized',
        url: error.url || undefined,
      });
    }

    if (error.status === 403) {
      return new HttpErrorResponse({
        error: 'Access denied. Check token permissions.',
        status: error.status,
        statusText: 'Forbidden',
        url: error.url || undefined,
      });
    }

    return safeError;
  }
}

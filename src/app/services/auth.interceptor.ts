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
    // Create safe error response without exposing internal details.
    // error.error is `null` for a network-level failure (no response body
    // at all) — `typeof null === 'object'` is true, so a naive `typeof
    // error.error === 'object'` check used to wrap that null body into a
    // fabricated `{ message: error.message }`, surfacing Angular's own
    // low-level "Http failure response for <url>: 0 undefined" text as if
    // it were a genuine backend error. Every consumer's `err.error?.message
    // || 'fallback'` pattern (repo-health.ts, gatekeeper.ts, members.ts,
    // etc.) would then show that raw string instead of its own friendly
    // fallback. Guard against null so those checks correctly see nothing
    // and fall through; when there IS a real object body, prefer its own
    // `.message` over the transport-level one.
    const hasBody = error.error !== null && error.error !== undefined;
    const safeError = {
      ...error,
      error:
        hasBody && typeof error.error === 'object'
          ? { message: (error.error as { message?: unknown })?.message ?? error.message }
          : error.error,
    };

    // status 0 means the request never reached a server at all (connection
    // refused/reset, DNS failure, CORS block, offline) — there is no
    // backend body to relay, so give one clear, actionable message here
    // rather than leaving every consumer to invent its own "network is
    // down" copy.
    if (error.status === 0) {
      return new HttpErrorResponse({
        error: 'Could not reach the server. Check your connection and try again.',
        status: error.status,
        statusText: 'Network Error',
        url: error.url || undefined,
      });
    }

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

    // Mongo-backed rate limiter (see rate-limit/) rejecting this request —
    // distinct from 401/403 in that the token/permissions are fine, the
    // caller just needs to slow down.
    if (error.status === 429) {
      return new HttpErrorResponse({
        error: 'Too many requests. Please wait a moment and try again.',
        status: error.status,
        statusText: 'Too Many Requests',
        url: error.url || undefined,
      });
    }

    // Idempotency-key conflict (see idempotency-cache.schema.ts) — the same
    // request key was already used with a different payload/is still in
    // flight, not an auth problem.
    if (error.status === 409) {
      return new HttpErrorResponse({
        error: 'This request conflicts with one already in progress or previously submitted. Please retry.',
        status: error.status,
        statusText: 'Conflict',
        url: error.url || undefined,
      });
    }

    return safeError;
  }
}

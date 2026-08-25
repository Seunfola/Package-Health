import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { PENDING_RETURN_URL_KEY } from '../auth-required/auth-required';

/**
 * Functional route guard: blocks unauthenticated users from reaching
 * protected routes (dashboard, notifications, user-profile,
 * dashboard-settings) and redirects them to the /auth-required interstitial
 * instead of silently bouncing them to /home with no explanation — a
 * visitor who clicked a link expecting real content deserves to be told
 * why they landed somewhere else and what to do next (design.md's "no
 * dead-end UI" principle applies to a redirect just as much as a missing
 * page). The attempted URL is stashed so a successful sign-in from that
 * page can return the visitor there instead of always landing on
 * /dashboard — same pattern as accept-invite/accept-transfer's pending-*
 * sessionStorage keys, consumed once by AuthCallbackComponent.
 *
 * Reuses AuthService.isAuthenticated() — the same check DashboardComponent
 * previously performed ad hoc in ngOnInit — so the behavior is centralized
 * and consistent across every protected route.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  try {
    sessionStorage.setItem(PENDING_RETURN_URL_KEY, state.url);
  } catch {
    // Storage unavailable (private browsing, quota) — sign-in still works,
    // it just falls back to the default post-login destination.
  }

  return router.createUrlTree(['/auth-required']);
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Functional route guard: blocks unauthenticated users from reaching
 * protected routes (dashboard, notifications, user-profile,
 * dashboard-settings) and redirects them to `/home`.
 *
 * Reuses AuthService.isAuthenticated() — the same check DashboardComponent
 * previously performed ad hoc in ngOnInit — so the behavior is centralized
 * and consistent across every protected route.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};

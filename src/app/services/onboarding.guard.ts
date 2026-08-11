import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Functional route guard: sends a freshly-authenticated, not-yet-onboarded
 * user to /onboarding before they reach the dashboard. Only an explicit
 * `false` redirects — `undefined` (a session predating this field) is
 * treated as already-onboarded, matching AuthState's own documented
 * semantics, so existing users never see a surprise wizard.
 */
export const onboardingGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentState.onboardingCompleted === false) {
    return router.createUrlTree(['/onboarding']);
  }

  return true;
};

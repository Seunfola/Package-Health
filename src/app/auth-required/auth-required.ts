import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLogin } from '../services/auth-login.component';

/** Where authGuard stashes the URL a signed-out visitor was trying to reach, so a
 *  successful sign-in from this page can return them there instead of always
 *  landing on /dashboard. Same shape as accept-invite's PENDING_INVITE_TOKEN_KEY /
 *  accept-transfer's PENDING_TRANSFER_KEY, consumed once by AuthCallbackComponent. */
export const PENDING_RETURN_URL_KEY = 'depvault_pending_return_url';

/**
 * The interstitial authGuard now redirects to instead of silently bouncing
 * an unauthenticated visitor to /home with no explanation (see
 * services/auth.guard.ts). Deliberately outside both PublicLayout and
 * DashboardLayout — same reasoning as NotFound: a visitor who isn't signed
 * in yet hasn't "picked a side" of the app, so this renders with no
 * navbar/sidebar assumption either way, just the .glass-card primitive and
 * the existing .btn-primary/.btn-secondary button system per design.md
 * Part III.4 (no new visual chrome).
 *
 * "Continue" opens the same <app-auth-login> OAuth modal every other entry
 * point uses (public-navbar, navbar) rather than inventing a second sign-in
 * surface or linking to a route that doesn't exist. "Go back" undoes the
 * navigation that got the visitor here — falling back to /home only when
 * there's no in-app history to return to (e.g. the protected URL was
 * opened directly).
 */
@Component({
  selector: 'app-auth-required',
  standalone: true,
  imports: [AuthLogin],
  templateUrl: './auth-required.html',
  styleUrl: './auth-required.css',
})
export class AuthRequiredPage {
  showLoginModal = false;

  constructor(private readonly router: Router) {}

  continue(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
}

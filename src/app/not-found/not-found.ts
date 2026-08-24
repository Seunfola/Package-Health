import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * design.md Part IV names this the fallback for both `/404` and unknown
 * routes (`**` in app.routes.ts) — previously those redirected silently to
 * /home, which QA flagged as a confusing dead end. This is deliberately
 * outside both PublicLayout and DashboardLayout (no navbar/sidebar) since a
 * truly unknown URL shouldn't assume which chrome the visitor meant to
 * land in; instead it offers a contextual primary action (Dashboard for a
 * signed-in visitor, Home otherwise) rather than guessing wrong either way.
 */
@Component({ selector: 'app-not-found', standalone: true, imports: [RouterLink], templateUrl: './not-found.html', styleUrl: './not-found.css' })
export class NotFound {
  constructor(private readonly authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}

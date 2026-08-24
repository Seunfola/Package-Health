import { Component, input, output } from '@angular/core';

/**
 * The failure counterpart to EmptyStateCard (../empty-state-card) — same
 * glass-card shell and layout so the two read as one family, but for "the
 * request failed" rather than "the request succeeded with nothing to show".
 * Keeping them visually related but distinct (danger-tinted icon here vs.
 * neutral muted icon there) lets a user tell "connect a repo to see data"
 * apart from "we couldn't reach the server just now" at a glance — design.md
 * Part I.3 treats conflating those two as exactly the kind of silent/
 * confusing failure this system exists to prevent.
 *
 * Always renders a Retry action (unlike EmptyStateCard, where an action is
 * optional) — a failure state with no way to recover from it is a dead end.
 */
@Component({
  selector: 'app-error-state-card',
  standalone: true,
  templateUrl: './error-state-card.html',
  styleUrl: './error-state-card.css',
})
export class ErrorStateCard {
  readonly title = input('Something went wrong');
  readonly message = input("We couldn't load this data. Check your connection and try again.");
  readonly retryLabel = input('Retry');
  readonly retry = output<void>();
}

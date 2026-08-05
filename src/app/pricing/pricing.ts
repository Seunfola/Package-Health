import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLogin } from '@/app/services/auth-login.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, AuthLogin],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class PricingPage {
  showLoginModal = false;

  /** Real values from apps/backend/src/organization/plan-limits.ts — not invented. */
  readonly freeFeatures = [
    '3 tracked repositories',
    '5 organization members',
    'Full Trust Score engine (all 4 ecosystems)',
    'Default Gatekeeper policy (read-only)',
  ];

  readonly paidFeatures = [
    'Unlimited tracked repositories',
    'Unlimited organization members',
    'Custom Gatekeeper scoring weights & thresholds',
    'Notification webhooks (Slack, Discord, xMatters, custom)',
    'Organization logo branding',
  ];

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }
}

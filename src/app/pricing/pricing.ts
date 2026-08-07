import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLogin } from '@/app/services/auth-login.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, AuthLogin, RouterLink],
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

  readonly comparisonRows = [
    { feature: 'Tracked repositories', free: '3', paid: 'Unlimited' },
    { feature: 'Organization members', free: '5', paid: 'Unlimited' },
    { feature: 'Trust Score engine (npm, PyPI, Cargo, Go)', free: true, paid: true },
    { feature: 'Gatekeeper policy', free: 'Default (read-only)', paid: 'Custom weights & thresholds' },
    { feature: 'Notification webhooks', free: false, paid: 'Slack, Discord, xMatters, custom' },
    { feature: 'Organization logo branding', free: false, paid: true },
  ];

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }
}

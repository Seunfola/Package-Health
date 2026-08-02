import { Component, Input } from '@angular/core';
import { SecurityAlertItem } from './security-alert-item/security-alert-item';
import { CommonModule } from '@angular/common';

export interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  package: string;
  vulnerable_version_range: string;
  first_patched_version: string | null;
  state: 'open' | 'fixed' | 'dismissed';
  created_at: string;
  description?: string;
}

@Component({
  selector: 'app-security-alerts',
  imports: [CommonModule, SecurityAlertItem],
  templateUrl: './security-alerts.html',
  styleUrl: './security-alerts.css',
})
export class SecurityAlerts {
  @Input() securityAlerts?: Vulnerability[] = [];

  // No fallback mock data: an empty/undefined securityAlerts list means the
  // scanned repo genuinely has no known vulnerabilities (or none were
  // returned yet) — showing fabricated CVEs (react XSS, express SQLi) in
  // that case would report an unsafe result for a repo that may be clean.
  // The template's empty state ("No vulnerabilities detected") already
  // handles this honestly.
  get displayAlerts(): Vulnerability[] {
    return this.securityAlerts ?? [];
  }

  get openAlertsCount(): number {
    return this.displayAlerts.filter((alert) => alert.state === 'open').length;
  }

  get criticalCount(): number {
    return this.displayAlerts.filter((alert) => alert.severity === 'critical').length;
  }

  get highCount(): number {
    return this.displayAlerts.filter((alert) => alert.severity === 'high').length;
  }
}

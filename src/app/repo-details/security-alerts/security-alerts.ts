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

  // Fallback mock data for development/testing
  fallbackAlerts = [
    {
      id: '1',
      severity: 'high' as const,
      title: 'XSS vulnerability in user input',
      package: 'react',
      vulnerable_version_range: '<18.0.0',
      first_patched_version: '18.0.0',
      state: 'open' as const,
      created_at: new Date().toISOString(),
      description: 'User input not properly sanitized',
    },
    {
      id: '2',
      severity: 'medium' as const,
      title: "Outdated dependency: 'lodash'",
      package: 'lodash',
      vulnerable_version_range: '<4.17.20',
      first_patched_version: '4.17.20',
      state: 'open' as const,
      created_at: new Date().toISOString(),
      description: 'Update lodash to latest version',
    },
    {
      id: '3',
      severity: 'critical' as const,
      title: 'SQL Injection risk in API endpoint',
      package: 'express',
      vulnerable_version_range: '<4.17.0',
      first_patched_version: '4.17.0',
      state: 'open' as const,
      created_at: new Date().toISOString(),
      description: 'SQL queries not properly parameterized',
    },
    {
      id: '4',
      severity: 'low' as const,
      title: 'Unused CSS rules identified',
      package: 'css-loader',
      vulnerable_version_range: '<5.0.0',
      first_patched_version: '5.0.0',
      state: 'fixed' as const,
      created_at: new Date().toISOString(),
      description: 'Remove unused CSS rules',
    },
  ];

  get displayAlerts(): Vulnerability[] {
    return this.securityAlerts && this.securityAlerts.length > 0
      ? this.securityAlerts
      : this.fallbackAlerts;
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

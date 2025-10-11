import { Component } from '@angular/core';
import { SecurityAlertItem } from './security-alert-item/security-alert-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-security-alerts',
  imports: [CommonModule, SecurityAlertItem],
  templateUrl: './security-alerts.html',
  styleUrl: './security-alerts.css',
})
export class SecurityAlerts {
  securityAlerts = [
    {
      severity: 'High',
      check: 'XSS vulnerability in user input',
      file: 'src/components/UserInput.tsx',
      status: 'Open',
    },
    {
      severity: 'Medium',
      check: "Outdated dependency: 'lodash'",
      file: 'package.json',
      status: 'Open',
    },
    {
      severity: 'High',
      check: 'SQL Injection risk in API endpoint',
      file: 'server/api/users.js',
      status: 'Open',
    },
    {
      severity: 'Low',
      check: 'Unused CSS rules identified',
      file: 'src/styles/main.css',
      status: 'Resolved',
    },
    {
      severity: 'Medium',
      check: 'Insecure cryptographic algorithm',
      file: 'src/utils/auth.ts',
      status: 'Open',
    },
  ];
}

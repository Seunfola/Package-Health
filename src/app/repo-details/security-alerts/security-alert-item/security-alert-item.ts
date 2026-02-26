import { Component, Input } from '@angular/core';
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
  selector: 'app-security-alert-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './security-alert-item.html',
  styleUrl: './security-alert-item.css',
})
export class SecurityAlertItem {
  @Input() vulnerability?: Vulnerability;
  @Input() severity: string = '';
  @Input() check: string = '';
  @Input() file: string = '';
  @Input() status: string = '';

  get severityLabel(): string {
    if (this.vulnerability) {
      return (
        this.vulnerability.severity.charAt(0).toUpperCase() + this.vulnerability.severity.slice(1)
      );
    }
    return this.severity;
  }

  get checkLabel(): string {
    return this.vulnerability?.title || this.check;
  }

  get fileLabel(): string {
    return this.vulnerability
      ? `${this.vulnerability.package}@${this.vulnerability.vulnerable_version_range}`
      : this.file;
  }

  get statusLabel(): string {
    if (this.vulnerability) {
      const state = this.vulnerability.state;
      return state.charAt(0).toUpperCase() + state.slice(1);
    }
    return this.status;
  }

  get stateClass(): string {
    if (this.vulnerability) {
      if (this.vulnerability.state === 'fixed' || this.vulnerability.state === 'dismissed') {
        return 'resolved';
      }
      return 'open';
    }
    return this.status === 'Open' ? 'open' : 'resolved';
  }
}

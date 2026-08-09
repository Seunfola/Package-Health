import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeakFinding } from '../../../services/leak-guard.service';

@Component({
  selector: 'app-leak-finding-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leak-finding-item.html',
  styleUrl: './leak-finding-item.css',
})
export class LeakFindingItem {
  @Input({ required: true }) finding!: LeakFinding;

  get severityLabel(): string {
    return this.finding.severity.charAt(0) + this.finding.severity.slice(1).toLowerCase();
  }

  get locationLabel(): string {
    return `${this.finding.file}:${this.finding.line}`;
  }

  get livenessLabel(): string {
    switch (this.finding.liveness) {
      case 'live':
        return 'Live';
      case 'dead':
        return 'Dead';
      case 'unknown':
        return 'Unknown';
      default:
        return 'Not checked';
    }
  }

  get statusLabel(): string {
    if (this.finding.allowlisted) return 'Allowlisted';
    if (this.finding.isLikelyPlaceholder) return 'Placeholder';
    return 'Active';
  }

  /** Drives the row's left accent + badge coloring — distinct from severity, since a live-verified secret needs to read as more urgent than an unchecked one of the same severity. */
  get isConfirmedLive(): boolean {
    return this.finding.liveness === 'live';
  }

  get isSuppressed(): boolean {
    return this.finding.allowlisted || this.finding.isLikelyPlaceholder;
  }
}

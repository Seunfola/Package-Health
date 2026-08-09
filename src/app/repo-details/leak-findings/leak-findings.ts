import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeakFindingItem } from './leak-finding-item/leak-finding-item';
import { LeakGuardScanResult, LeakFinding } from '../../services/leak-guard.service';

@Component({
  selector: 'app-leak-findings',
  standalone: true,
  imports: [CommonModule, LeakFindingItem],
  templateUrl: './leak-findings.html',
  styleUrl: './leak-findings.css',
})
export class LeakFindings {
  /** Null means "no LeakGuard scan has ever been uploaded for this repo" — distinct from a scan that ran and found nothing. */
  @Input() scan: LeakGuardScanResult | null = null;
  @Input() loading = false;

  get findings(): LeakFinding[] {
    return this.scan?.findings ?? [];
  }

  get hasScan(): boolean {
    return this.scan !== null;
  }

  get isClean(): boolean {
    return this.hasScan && this.findings.length === 0;
  }

  get criticalCount(): number {
    return this.findings.filter((f) => f.severity === 'CRITICAL').length;
  }

  get highCount(): number {
    return this.findings.filter((f) => f.severity === 'HIGH').length;
  }

  get liveCount(): number {
    return this.findings.filter((f) => f.liveness === 'live').length;
  }

  get lastScannedLabel(): string | null {
    if (!this.scan?.updatedAt) return null;
    return new Date(this.scan.updatedAt).toLocaleString();
  }
}

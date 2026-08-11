import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeakGuardService, LeakGuardScanResult } from '@/app/services/leak-guard.service';
import { EmptyStateCard } from '@/app/reusable/empty-state-card/empty-state-card';

/**
 * Full LeakGuard scan list — split out of DashboardComponent for the same
 * reason as Repositories: the Overview stays a quick summary, this page
 * owns the whole table. Backend has no pagination for this endpoint yet
 * (GET /api/repos/leak-scans/mine returns everything), so there's no
 * pager here — just the full list, same as before extraction.
 */
@Component({
  selector: 'app-dashboard-leak-scans',
  standalone: true,
  imports: [CommonModule, EmptyStateCard],
  templateUrl: './leak-scans.html',
  styleUrls: ['./leak-scans.css', '../dashboard-shared.css'],
})
export class DashboardLeakScans implements OnInit {
  scans: LeakGuardScanResult[] = [];
  isLoading = true;
  error = '';

  constructor(
    private readonly leakGuardService: LeakGuardService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.error = '';

    this.leakGuardService.getMyLeakScans().subscribe({
      next: (scans) => {
        this.scans = scans;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load LeakGuard scans', err);
        this.error = 'Failed to load your LeakGuard scans.';
        this.isLoading = false;
      },
    });
  }

  /** Findings that actually need attention — excludes allowlisted/placeholder matches, same as the CLI's own gate logic. */
  activeFindingCount(scan: LeakGuardScanResult): number {
    return scan.findings.filter((f) => !f.allowlisted && !f.isLikelyPlaceholder).length;
  }

  get totalActiveFindings(): number {
    return this.scans.reduce((sum, scan) => sum + this.activeFindingCount(scan), 0);
  }

  get reposWithActiveFindings(): number {
    return this.scans.filter((scan) => this.activeFindingCount(scan) > 0).length;
  }

  viewScan(scan: LeakGuardScanResult): void {
    this.router.navigate(['/repository-details', scan.owner, scan.repo]);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AuthState } from '../services/auth.service';
import { RepoService, RepoListItem, RepoStats } from '../services/RepoService';
import { LeakGuardService, LeakGuardScanResult } from '../services/leak-guard.service';
import { StatusCard } from '../reusable/status-card/status-card';
import { Observable } from 'rxjs';
import { UnauthorizedWarning } from '../shared/unauthorized-warning/unauthorized-warning';
import { EmptyStateCard } from '../reusable/empty-state-card/empty-state-card';

interface StatTile {
  title: string;
  value: string;
  icon: string;
  iconContainerBg: string;
  iconFillColor: string;
  cardBorderRadius: string;
}

/** How many rows the Overview's "recent" previews show before pointing to the full subroute. */
const PREVIEW_LIMIT = 5;

/**
 * Dashboard Overview — a quick summary (stat tiles + the 5 most recent
 * repositories/LeakGuard scans), not the full browsing experience. The full
 * paginated tables live at /dashboard/repositories and
 * /dashboard/leak-scans (DashboardRepositories, DashboardLeakScans) — this
 * split keeps the landing page fast to scan instead of dumping every table
 * a returning user has already seen.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatusCard, UnauthorizedWarning, EmptyStateCard],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css', './dashboard-shared.css'],
})
export class DashboardComponent implements OnInit {
  authState$: Observable<AuthState>;

  recentRepos: RepoListItem[] = [];
  statTiles: StatTile[] = [];

  isLoadingRepos = true;
  reposError = '';
  isLoadingStats = true;
  totalRepoCount = 0;

  recentLeakScans: LeakGuardScanResult[] = [];
  isLoadingLeakScans = true;
  leakScansError = '';

  constructor(
    private readonly authService: AuthService,
    private readonly repoService: RepoService,
    private readonly leakGuardService: LeakGuardService,
    private readonly router: Router,
  ) {
    this.authState$ = this.authService.authState$;
  }

  ngOnInit(): void {
    this.loadRecentRepos();
    this.loadStats();
    this.loadRecentLeakScans();
  }

  loadRecentLeakScans(): void {
    this.isLoadingLeakScans = true;
    this.leakScansError = '';

    this.leakGuardService.getMyLeakScans().subscribe({
      next: (scans) => {
        this.recentLeakScans = scans.slice(0, PREVIEW_LIMIT);
        this.isLoadingLeakScans = false;
      },
      error: (err) => {
        console.error('Failed to load LeakGuard scans', err);
        this.leakScansError = 'Failed to load your LeakGuard scans.';
        this.isLoadingLeakScans = false;
      },
    });
  }

  /** Findings that actually need attention — excludes allowlisted/placeholder matches, same as the CLI's own gate logic. */
  activeFindingCount(scan: LeakGuardScanResult): number {
    return scan.findings.filter((f) => !f.allowlisted && !f.isLikelyPlaceholder).length;
  }

  viewLeakScan(scan: LeakGuardScanResult): void {
    this.router.navigate(['/repository-details', scan.owner, scan.repo]);
  }

  loadRecentRepos(): void {
    this.isLoadingRepos = true;
    this.reposError = '';

    this.repoService.getRepos(1, PREVIEW_LIMIT).subscribe({
      next: (result) => {
        this.recentRepos = result.data;
        this.totalRepoCount = result.total;
        this.isLoadingRepos = false;
      },
      error: (err) => {
        console.error('Failed to load repositories', err);
        this.reposError = 'Failed to load your analyzed repositories.';
        this.isLoadingRepos = false;
      },
    });
  }

  loadStats(): void {
    this.isLoadingStats = true;

    this.repoService.getRepoStats().subscribe({
      next: (stats) => {
        this.statTiles = this.buildStatTiles(stats);
        this.isLoadingStats = false;
      },
      error: (err) => {
        console.error('Failed to load repository stats', err);
        this.isLoadingStats = false;
      },
    });
  }

  connectRepo(): void {
    this.router.navigate(['/dashboard-settings']);
  }

  viewRepo(repo: RepoListItem): void {
    this.router.navigate(['/repository-details', repo.owner, repo.repo]);
  }

  goToRepositories(): void {
    this.router.navigate(['/dashboard/repositories']);
  }

  goToLeakScans(): void {
    this.router.navigate(['/dashboard/leak-scans']);
  }

  getHealthLevel(score: number | undefined): 'excellent' | 'good' | 'moderate' | 'poor' {
    const s = score ?? 0;
    if (s >= 80) return 'excellent';
    if (s >= 60) return 'good';
    if (s >= 40) return 'moderate';
    return 'poor';
  }

  private buildStatTiles(stats: RepoStats): StatTile[] {
    return [
      {
        title: 'Protected Repositories',
        value: `${stats.totalRepos}`,
        icon: 'assets/icons/shield.svg',
        iconContainerBg: 'rgba(99, 102, 241, 0.15)',
        iconFillColor: '',
        cardBorderRadius: '12px',
      },
      {
        title: 'Average Health Score',
        value: `${stats.averageHealth}`,
        icon: 'assets/icons/gauge.svg',
        iconContainerBg: 'rgba(59, 130, 246, 0.15)',
        iconFillColor: '',
        cardBorderRadius: '12px',
      },
      {
        title: 'Excellent Health (80+)',
        value: `${stats.healthDistribution.excellent}`,
        icon: 'assets/icons/check.svg',
        iconContainerBg: 'rgba(34, 197, 94, 0.15)',
        iconFillColor: '',
        cardBorderRadius: '12px',
      },
      {
        title: 'Needs Attention (<40)',
        value: `${stats.healthDistribution.poor}`,
        icon: 'assets/icons/alert.svg',
        iconContainerBg: 'rgba(239, 68, 68, 0.15)',
        iconFillColor: '',
        cardBorderRadius: '12px',
      },
    ];
  }
}

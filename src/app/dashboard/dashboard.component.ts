import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AuthState } from '../services/auth.service';
import { RepoService, RepoListItem, RepoStats } from '../services/RepoService';
import { StatusCard } from '../reusable/status-card/status-card';
import { Observable } from 'rxjs';
import { UnauthorizedWarning } from '../shared/unauthorized-warning/unauthorized-warning';

interface StatTile {
  title: string;
  value: string;
  icon: string;
  iconContainerBg: string;
  iconFillColor: string;
  cardBorderRadius: string;
}

/**
 * Dashboard: real content wired to the backend's repo listing/stats endpoints
 * (`GET /api/repos`, `GET /api/repos/stats`, Part A3). Auth is now enforced by
 * `authGuard` on the route itself (see app.routes.ts) rather than an ad hoc
 * check here.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatusCard, UnauthorizedWarning],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  authState$: Observable<AuthState>;

  repos: RepoListItem[] = [];
  statTiles: StatTile[] = [];

  isLoadingRepos = true;
  reposError = '';
  isLoadingStats = true;

  page = 1;
  readonly limit = 10;
  total = 0;
  totalPages = 0;

  constructor(
    private readonly authService: AuthService,
    private readonly repoService: RepoService,
    private readonly router: Router,
  ) {
    this.authState$ = this.authService.authState$;
  }

  ngOnInit(): void {
    this.loadRepos();
    this.loadStats();
  }

  loadRepos(page: number = 1): void {
    this.isLoadingRepos = true;
    this.reposError = '';

    this.repoService.getRepos(page, this.limit).subscribe({
      next: (result) => {
        this.repos = result.data;
        this.page = result.page;
        this.total = result.total;
        this.totalPages = result.totalPages;
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

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.loadRepos(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.loadRepos(this.page - 1);
    }
  }

  connectRepo(): void {
    this.router.navigate(['/dashboard-settings']);
  }

  viewRepo(repo: RepoListItem): void {
    this.router.navigate(['/repository-details', repo.owner, repo.repo]);
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
        iconFillColor: 'invert(100%)',
        cardBorderRadius: '12px',
      },
      {
        title: 'Average Health Score',
        value: `${stats.averageHealth}`,
        icon: 'assets/icons/gauge.svg',
        iconContainerBg: 'rgba(59, 130, 246, 0.15)',
        iconFillColor: 'invert(100%)',
        cardBorderRadius: '12px',
      },
      {
        title: 'Excellent Health (80+)',
        value: `${stats.healthDistribution.excellent}`,
        icon: 'assets/icons/check.svg',
        iconContainerBg: 'rgba(34, 197, 94, 0.15)',
        iconFillColor: 'invert(100%)',
        cardBorderRadius: '12px',
      },
      {
        title: 'Needs Attention (<40)',
        value: `${stats.healthDistribution.poor}`,
        icon: 'assets/icons/alert.svg',
        iconContainerBg: 'rgba(239, 68, 68, 0.15)',
        iconFillColor: 'invert(100%)',
        cardBorderRadius: '12px',
      },
    ];
  }
}

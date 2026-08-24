import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RepoService, RepoListItem } from '@/app/services/RepoService';
import { EmptyStateCard } from '@/app/reusable/empty-state-card/empty-state-card';
import { ErrorStateCard } from '@/app/reusable/error-state-card/error-state-card';
import { Skeleton } from '@/app/reusable/skeleton/skeleton';

/**
 * Full, paginated repository list — split out of DashboardComponent so the
 * Overview page can stay a quick summary (top 5 + "View all") while this
 * page owns the real table and pagination. Same data source (RepoService),
 * just a bigger page size since browsing the full list is the whole point
 * here.
 */
@Component({
  selector: 'app-dashboard-repositories',
  standalone: true,
  imports: [CommonModule, EmptyStateCard, ErrorStateCard, Skeleton],
  templateUrl: './repositories.html',
  styleUrls: ['./repositories.css', '../dashboard-shared.css'],
})
export class DashboardRepositories implements OnInit {
  repos: RepoListItem[] = [];
  isLoading = true;
  error = '';

  page = 1;
  readonly limit = 20;
  total = 0;
  totalPages = 0;

  constructor(
    private readonly repoService: RepoService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(page: number = 1): void {
    this.isLoading = true;
    this.error = '';

    this.repoService.getRepos(page, this.limit).subscribe({
      next: (result) => {
        this.repos = result.data;
        this.page = result.page;
        this.total = result.total;
        this.totalPages = result.totalPages;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load repositories', err);
        this.error = 'Failed to load your analyzed repositories.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.load(this.page + 1);
  }

  previousPage(): void {
    if (this.page > 1) this.load(this.page - 1);
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
}

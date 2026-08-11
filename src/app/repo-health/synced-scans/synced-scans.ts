import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RepoService, RepoListItem } from '@/app/services/RepoService';

/**
 * Repositories analyzed locally and synced via `depvault upload` — moved
 * out of the giant Settings page (where it lived only because that's where
 * CLI/token-related things happened to sit) into Package Health, where this
 * data actually belongs conceptually. Same RepoService.getMyUploadedRepos()
 * call, unchanged.
 */
@Component({
  selector: 'app-synced-scans',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './synced-scans.html',
  styleUrl: './synced-scans.css',
})
export class SyncedScans implements OnInit {
  repos: RepoListItem[] = [];
  isLoading = true;
  error = '';

  constructor(
    private readonly repoService: RepoService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.error = '';

    this.repoService.getMyUploadedRepos().subscribe({
      next: (repos) => {
        this.repos = repos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load synced scans', err);
        this.error = 'Failed to load your synced scans.';
        this.isLoading = false;
      },
    });
  }

  getHealthLevel(score: number | undefined): 'excellent' | 'good' | 'moderate' | 'poor' {
    const s = score ?? 0;
    if (s >= 80) return 'excellent';
    if (s >= 60) return 'good';
    if (s >= 40) return 'moderate';
    return 'poor';
  }

  viewRepo(repo: RepoListItem): void {
    this.router.navigate(['/repository-details', repo.owner, repo.repo]);
  }
}

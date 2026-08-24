import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserProfileService, ProfileListItem } from '@/app/services/user-profile.service';
import { ErrorStateCard } from '@/app/reusable/error-state-card/error-state-card';
import { Skeleton } from '@/app/reusable/skeleton/skeleton';

/**
 * The "all profiles" listing privacy.html has always described but that
 * never had a UI consumer — the backend route (`GET /profile`) existed,
 * unauthenticated, with no page ever calling it. Now it's an actual
 * in-product directory: authenticated (this route lives under
 * DashboardLayout, gated by authGuard), paginated with the same
 * limit + cursor "Load more" shape MembersSettings uses for the org audit
 * log, and — per the privacy policy's specific promise — never shows email.
 */
@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule, ErrorStateCard, Skeleton],
  templateUrl: './directory.html',
  styleUrl: './directory.css',
})
export class Directory implements OnInit {
  private static readonly PAGE_SIZE = 20;

  profiles: ProfileListItem[] = [];
  isLoading = false;
  isLoadingMore = false;
  error = '';
  hasMore = false;

  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.error = '';
    this.userProfileService.listProfiles({ limit: Directory.PAGE_SIZE }).subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        this.hasMore = profiles.length === Directory.PAGE_SIZE;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load profile directory', err);
        this.error = 'Failed to load the profile directory.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  /** Fetches the next alphabetical page, using the last-loaded username as the cursor. */
  loadMore(): void {
    if (this.isLoadingMore || !this.profiles.length) return;

    this.isLoadingMore = true;
    const lastLoaded = this.profiles[this.profiles.length - 1];

    this.userProfileService
      .listProfiles({ limit: Directory.PAGE_SIZE, after: lastLoaded.username })
      .subscribe({
        next: (profiles) => {
          this.profiles = [...this.profiles, ...profiles];
          this.hasMore = profiles.length === Directory.PAGE_SIZE;
          this.isLoadingMore = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load more profiles', err);
          this.isLoadingMore = false;
          this.cdr.markForCheck();
        },
      });
  }
}

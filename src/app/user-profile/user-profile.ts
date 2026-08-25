import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from '@/app/services/user-profile.service';
import { AuthService } from '@/app/services/auth.service';
import { Subscription } from 'rxjs';
import { UnauthorizedWarning } from '@/app/shared/unauthorized-warning/unauthorized-warning';
import { ErrorStateCard } from '@/app/reusable/error-state-card/error-state-card';
import { Skeleton } from '@/app/reusable/skeleton/skeleton';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UnauthorizedWarning, ErrorStateCard, Skeleton],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit, OnDestroy {
  internalUsername: string = '';
  userName: string = 'User';
  userEmail: string = '';
  userAvatar: string = 'assets/icons/user.svg';

  resumeFileName: string = '';
  bio: string = '';

  githubUrl: string = '';
  linkedinUrl: string = '';
  twitterUrl: string = '';
  location: string = '';
  skills: string[] = [];
  /** Comma-separated editable form of `skills`, since the schema stores an array but a text input needs a string. */
  skillsInput: string = '';
  statusMessage: string = '';
  statusType: 'success' | 'error' = 'success';

  // Inputs for the "Link X" buttons — a username/handle to resolve, not the stored URL itself.
  githubUsername: string = '';
  linkedinProfileUrl: string = '';
  twitterHandle: string = '';

  isLoading = true;
  isSaving = false;
  /** Only set for a genuine load failure — never had profile data yet. */
  loadError = '';
  private authSub?: Subscription;

  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  get authState$() {
    return this.authService.authState$;
  }

  ngOnInit(): void {
    this.authSub = this.authService.authState$.subscribe(state => {
      if (state.isAuthenticated && state.username) {
        this.internalUsername = state.username;
        // Load the extended profile data from the backend
        this.loadProfile(this.internalUsername);
      } else {
        this.isLoading = false;
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) this.authSub.unsubscribe();
  }

  loadProfile(username: string): void {
    this.isLoading = true;
    this.loadError = '';
    this.userProfileService.getProfile(username).subscribe({
      next: (profile) => {
        this.userName = profile.username || 'User';
        this.userEmail = profile.email || '';
        this.userAvatar = profile.profile_picture_url || 'assets/icons/user.svg';
        this.githubUrl = profile.github_url || '';
        this.linkedinUrl = profile.linkedin_url || '';
        this.twitterUrl = profile.twitter_url || '';
        this.bio = profile.bio || '';
        this.location = profile.location || '';
        this.skills = profile.skills || [];
        this.skillsInput = this.skills.join(', ');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.loadError = 'Failed to load your profile.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  retryLoadProfile(): void {
    if (this.internalUsername) this.loadProfile(this.internalUsername);
  }

  /** Saves bio/location/skills — the fields with no dedicated "Link X" flow of their own. */
  saveProfile(): void {
    this.isSaving = true;
    const skills = this.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    this.userProfileService.updateProfile({ bio: this.bio, location: this.location, skills }).subscribe({
      next: () => {
        this.skills = skills;
        this.isSaving = false;
        this.setStatus('Profile saved.', 'success');
      },
      error: (err) => {
        console.error('Failed to save profile', err);
        this.isSaving = false;
        this.setStatus('Failed to save profile.', 'error');
      },
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.setStatus('Resume file exceeds 2MB limit.', 'error');
      return;
    }

    if (!this.internalUsername) {
      this.setStatus('You must be logged in to upload a resume.', 'error');
      return;
    }

    this.resumeFileName = file.name;
    this.setStatus('Uploading and analyzing resume...', 'success');

    this.userProfileService.uploadResume(file).subscribe({
      next: (res) => {
        this.setStatus('Resume analyzed and profile updated.', 'success');
        if (this.internalUsername) {
          this.loadProfile(this.internalUsername);
        }
      },
      error: (err) => {
        console.error('Resume upload failed', err);
        this.setStatus('Failed to upload resume.', 'error');
      }
    });
  }

  linkGithub(): void {
    this.githubUsername = this.githubUsername.trim().replace(/^@/, '');
    const valid = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(this.githubUsername);
    if (!valid) {
      this.setStatus('Invalid GitHub username format.', 'error');
      return;
    }
    
    this.userProfileService.linkSocialProfile('github', this.githubUsername).subscribe({
      next: () => {
        this.setStatus('GitHub profile linked.', 'success');
        if (this.internalUsername) this.loadProfile(this.internalUsername);
      },
      error: () => this.setStatus('Failed to link GitHub profile.', 'error')
    });
  }

  linkLinkedin(): void {
    this.linkedinProfileUrl = this.linkedinProfileUrl.trim();
    if (!/^https:\/\/(www\.)?linkedin\.com\//i.test(this.linkedinProfileUrl)) {
      this.setStatus('LinkedIn URL must start with https://www.linkedin.com/', 'error');
      return;
    }
    
    this.userProfileService.linkSocialProfile('linkedin', this.linkedinProfileUrl).subscribe({
      next: () => {
        this.setStatus('LinkedIn profile linked.', 'success');
        if (this.internalUsername) this.loadProfile(this.internalUsername);
      },
      error: () => this.setStatus('Failed to link LinkedIn profile.', 'error')
    });
  }

  linkTwitter(): void {
    this.twitterHandle = this.twitterHandle.trim().replace(/^@/, '');
    if (!/^[A-Za-z0-9_]{1,15}$/.test(this.twitterHandle)) {
      this.setStatus('Twitter handle must be 1-15 characters (letters, numbers, underscore).', 'error');
      return;
    }
    
    this.userProfileService.linkSocialProfile('twitter', this.twitterHandle).subscribe({
      next: () => {
        this.setStatus('Twitter account linked.', 'success');
        if (this.internalUsername) this.loadProfile(this.internalUsername);
      },
      error: () => this.setStatus('Failed to link Twitter account.', 'error')
    });
  }

  exportProfileFile(): void {
    const profile = {
      userName: this.userName,
      userEmail: this.userEmail,
      bio: this.bio,
      githubUrl: this.githubUrl,
      linkedinUrl: this.linkedinUrl,
      twitterUrl: this.twitterUrl,
      location: this.location,
      skills: this.skills,
    };
    const payload = JSON.stringify(profile, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'user-profile.json';
    anchor.click();

    URL.revokeObjectURL(objectUrl);
  }

  private setStatus(message: string, type: 'success' | 'error'): void {
    this.statusMessage = message;
    this.statusType = type;
    // Centralizing the zoneless re-render trigger here (rather than at each
    // of the 8 call sites) covers every async subscribe callback that routes
    // through this helper — saveProfile, onFileSelected, and all three
    // linkX() methods.
    this.cdr.markForCheck();
  }
}

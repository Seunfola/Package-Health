import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from '@/app/services/user-profile.service';
import { AuthService } from '@/app/services/auth.service';
import { Subscription } from 'rxjs';
import { UnauthorizedWarning } from '@/app/shared/unauthorized-warning/unauthorized-warning';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UnauthorizedWarning],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit, OnDestroy {
  internalUsername: string = '';
  userName: string = 'User';
  userEmail: string = '';
  userAvatar: string = 'assets/icons/user.svg';

  resumeFileName: string = '';
  profileSummary: string = '';

  githubUsername: string = '';
  linkedinProfileUrl: string = '';
  twitterHandle: string = '';
  phoneNumber: string = '';
  location: string = '';
  skills: string[] = [];
  statusMessage: string = '';
  statusType: 'success' | 'error' = 'success';

  isLoading = true;
  private authSub?: Subscription;

  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly authService: AuthService
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
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) this.authSub.unsubscribe();
  }

  loadProfile(username: string): void {
    this.isLoading = true;
    this.userProfileService.getProfile(username).subscribe({
      next: (profile) => {
        this.userName = profile.username || 'User';
        this.userEmail = profile.email || '';
        this.githubUsername = profile.githubUsername || '';
        this.linkedinProfileUrl = profile.linkedinProfileUrl || '';
        this.twitterHandle = profile.twitterHandle || '';
        this.profileSummary = profile.profileSummary || '';
        this.location = profile.location || '';
        this.skills = profile.skills || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.isLoading = false;
      }
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
      next: () => this.setStatus('GitHub profile linked.', 'success'),
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
      next: () => this.setStatus('LinkedIn profile linked.', 'success'),
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
      next: () => this.setStatus('Twitter account linked.', 'success'),
      error: () => this.setStatus('Failed to link Twitter account.', 'error')
    });
  }

  addSocialLink(): void {
    alert('Adding new social link functionality (not implemented in UI)');
  }


  exportProfileFile(): void {
    const profile = {
      userName: this.userName,
      userEmail: this.userEmail,
      githubUsername: this.githubUsername,
      linkedinProfileUrl: this.linkedinProfileUrl,
      twitterHandle: this.twitterHandle,
      phoneNumber: this.phoneNumber,
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
  }
}

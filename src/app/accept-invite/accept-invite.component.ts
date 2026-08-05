import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OrganizationService } from '../services/organization.service';

export const PENDING_INVITE_TOKEN_KEY = 'pending_invite_token';

@Component({
  selector: 'app-accept-invite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accept-invite.component.html',
  styleUrl: './accept-invite.component.css',
})
export class AcceptInviteComponent implements OnInit {
  status: 'loading' | 'needs-auth' | 'success' | 'error' = 'loading';
  message = '';
  orgName = '';
  private token = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly organizationService: OrganizationService,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];

    if (!this.token) {
      this.status = 'error';
      this.message = 'This invitation link is missing its token — check you copied the full URL from the email.';
      return;
    }

    if (!this.authService.isAuthenticated()) {
      sessionStorage.setItem(PENDING_INVITE_TOKEN_KEY, this.token);
      this.status = 'needs-auth';
      return;
    }

    this.acceptNow();
  }

  private acceptNow(): void {
    this.status = 'loading';
    this.organizationService.acceptInvitation(this.token).subscribe({
      next: (res) => {
        this.status = 'success';
        this.orgName = res.orgName;
        sessionStorage.removeItem(PENDING_INVITE_TOKEN_KEY);
      },
      error: (err) => {
        this.status = 'error';
        this.message = err.error?.message || 'Failed to accept the invitation. It may have expired or already been used.';
        sessionStorage.removeItem(PENDING_INVITE_TOKEN_KEY);
      },
    });
  }

  loginWithGithub(): void {
    this.authService.loginWithGithub();
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  goToSettings(): void {
    this.router.navigate(['/dashboard-settings']);
  }
}

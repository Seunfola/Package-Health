import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OrganizationService } from '../services/organization.service';

export const PENDING_TRANSFER_KEY = 'pending_transfer';

interface PendingTransfer {
  orgId: string;
  token: string;
}

@Component({
  selector: 'app-accept-transfer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accept-transfer.component.html',
  styleUrl: './accept-transfer.component.css',
})
export class AcceptTransferComponent implements OnInit {
  status: 'loading' | 'needs-auth' | 'success' | 'error' = 'loading';
  message = '';
  private orgId = '';
  private token = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly organizationService: OrganizationService,
  ) {}

  ngOnInit(): void {
    this.orgId = this.route.snapshot.queryParams['orgId'];
    this.token = this.route.snapshot.queryParams['token'];

    if (!this.orgId || !this.token) {
      this.status = 'error';
      this.message = 'This transfer link is missing information — check you copied the full URL from the email.';
      return;
    }

    if (!this.authService.isAuthenticated()) {
      sessionStorage.setItem(
        PENDING_TRANSFER_KEY,
        JSON.stringify({ orgId: this.orgId, token: this.token } satisfies PendingTransfer),
      );
      this.status = 'needs-auth';
      return;
    }

    this.acceptNow();
  }

  private acceptNow(): void {
    this.status = 'loading';
    this.organizationService.acceptTransfer(this.orgId, { transferToken: this.token }).subscribe({
      next: (res) => {
        this.status = 'success';
        this.message = res.message;
        sessionStorage.removeItem(PENDING_TRANSFER_KEY);
      },
      error: (err) => {
        this.status = 'error';
        this.message = err.error?.message || 'Failed to accept the transfer. It may have expired or already been used.';
        sessionStorage.removeItem(PENDING_TRANSFER_KEY);
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

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsCard } from '../settings/settings-card/settings-card';
import { PersonalAccessTokenService, PersonalAccessTokenSummary } from '@/app/services/personal-access-token.service';
import { Skeleton } from '@/app/reusable/skeleton/skeleton';

@Component({
  selector: 'app-tokens-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SettingsCard, Skeleton],
  templateUrl: './tokens.html',
  styleUrls: ['./tokens.css', '../settings-shared.css'],
})
export class TokensSettings implements OnInit {
  // Personal Access Tokens — long-lived, revocable, used by the CLI/IDE
  // extension/CI instead of the short-lived (1h) browser session JWT.
  personalAccessTokens: PersonalAccessTokenSummary[] = [];
  isLoadingTokens = false;
  newTokenName = '';
  isCreatingToken = false;
  createTokenError = '';
  /** Set only immediately after creation — the raw value is never retrievable again, so this is cleared as soon as the user dismisses it. */
  justCreatedToken: string | null = null;
  revokingTokenId: string | null = null;
  patCopied = false;
  loadError = '';

  constructor(
    private readonly personalAccessTokenService: PersonalAccessTokenService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPersonalAccessTokens();
  }

  loadPersonalAccessTokens(): void {
    this.isLoadingTokens = true;
    this.loadError = '';
    this.personalAccessTokenService.list().subscribe({
      next: (tokens) => {
        this.personalAccessTokens = tokens;
        this.isLoadingTokens = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load personal access tokens', err);
        this.loadError = 'Failed to load your personal access tokens.';
        this.isLoadingTokens = false;
        this.cdr.markForCheck();
      },
    });
  }

  createPersonalAccessToken(): void {
    const name = this.newTokenName.trim();
    if (!name || this.isCreatingToken) return;

    this.isCreatingToken = true;
    this.createTokenError = '';
    this.personalAccessTokenService.create(name).subscribe({
      next: ({ token, summary }) => {
        this.justCreatedToken = token;
        this.personalAccessTokens = [summary, ...this.personalAccessTokens];
        this.newTokenName = '';
        this.isCreatingToken = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.createTokenError = err?.error?.message || 'Failed to create token.';
        this.isCreatingToken = false;
        this.cdr.markForCheck();
      },
    });
  }

  dismissNewToken(): void {
    this.justCreatedToken = null;
    this.patCopied = false;
  }

  copyPatToken(token: string): void {
    navigator.clipboard.writeText(token).then(() => {
      this.patCopied = true;
      this.cdr.markForCheck();
      setTimeout(() => {
        this.patCopied = false;
        this.cdr.markForCheck();
      }, 3000);
    });
  }

  revokePersonalAccessToken(id: string): void {
    this.revokingTokenId = id;
    this.personalAccessTokenService.revoke(id).subscribe({
      next: () => {
        this.personalAccessTokens = this.personalAccessTokens.filter((t) => t.id !== id);
        this.revokingTokenId = null;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to revoke token', err);
        this.revokingTokenId = null;
        this.cdr.markForCheck();
      },
    });
  }
}

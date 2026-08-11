import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@/app/services/auth.service';
import { RepoHealthAnalysisService, RepositoryAnalysisResult } from '@/app/services/repo-health-analysis.service';
import { PersonalAccessTokenService } from '@/app/services/personal-access-token.service';

type WizardStep = 1 | 2 | 3 | 4;

/**
 * Post-signup onboarding wizard — shown once, gated by onboardingGuard via
 * AuthState.onboardingCompleted. Each step does something real (runs an
 * actual scan, mints an actual token) rather than just describing the
 * product, since a first-run flow that's purely marketing copy is what the
 * user explicitly asked to replace.
 */
@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class OnboardingWizard {
  readonly totalSteps = 4;
  step: WizardStep = 1;
  isFinishing = false;

  // Step 2 — analyze a first repo
  repoUrl = '';
  isAnalyzing = false;
  analyzeError = '';
  analyzeResult: RepositoryAnalysisResult | null = null;

  // Step 3 — personal access token for the CLI/IDE extension
  newTokenName = 'My laptop';
  isCreatingToken = false;
  createTokenError = '';
  justCreatedToken: string | null = null;
  patCopied = false;
  copiedCommand: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly repoHealthAnalysisService: RepoHealthAnalysisService,
    private readonly personalAccessTokenService: PersonalAccessTokenService,
    private readonly router: Router,
  ) {}

  get username(): string {
    return this.authService.currentState.username || 'there';
  }

  goTo(step: number): void {
    // Only backward navigation via the step chips — forward jumps must go
    // through next() so a skipped step's own state stays consistent.
    if (step >= 1 && step <= this.totalSteps && step < this.step) this.step = step as WizardStep;
  }

  next(): void {
    if (this.step < this.totalSteps) this.step = (this.step + 1) as WizardStep;
  }

  back(): void {
    if (this.step > 1) this.step = (this.step - 1) as WizardStep;
  }

  async skip(): Promise<void> {
    await this.finish();
  }

  async finish(): Promise<void> {
    if (this.isFinishing) return;
    this.isFinishing = true;
    await this.authService.completeOnboarding();
    this.router.navigate(['/dashboard']);
  }

  analyzeRepo(): void {
    const url = this.repoUrl.trim();
    if (!url || this.isAnalyzing) return;

    this.isAnalyzing = true;
    this.analyzeError = '';
    this.analyzeResult = null;

    this.repoHealthAnalysisService.analyzeRepository(url).subscribe({
      next: (result) => {
        this.analyzeResult = result;
        this.isAnalyzing = false;
      },
      error: (err) => {
        this.analyzeError =
          err?.status === 404
            ? 'Repository not found — check the URL, or it may be private (you can analyze private repos later from Repo Health).'
            : err?.error?.message || 'Analysis failed. Verify the URL and try again.';
        this.isAnalyzing = false;
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

  createPersonalAccessToken(): void {
    const name = this.newTokenName.trim();
    if (!name || this.isCreatingToken) return;

    this.isCreatingToken = true;
    this.createTokenError = '';
    this.personalAccessTokenService.create(name).subscribe({
      next: ({ token }) => {
        this.justCreatedToken = token;
        this.isCreatingToken = false;
      },
      error: (err) => {
        this.createTokenError = err?.error?.message || 'Failed to create token.';
        this.isCreatingToken = false;
      },
    });
  }

  copyPatToken(token: string): void {
    navigator.clipboard.writeText(token).then(() => {
      this.patCopied = true;
      setTimeout(() => (this.patCopied = false), 3000);
    });
  }

  copyCommand(command: string): void {
    navigator.clipboard.writeText(command).then(() => {
      this.copiedCommand = command;
      setTimeout(() => {
        if (this.copiedCommand === command) this.copiedCommand = null;
      }, 2000);
    });
  }
}

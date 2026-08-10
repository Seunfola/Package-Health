import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { RepoHealthAnalysisService, RepositoryAnalysisResult } from './repo-health-analysis.service';
import { GithubAppService, GithubAppInstallation } from './github-app.service';
import { IconComponent } from '@/app/shared/icon/icon';

/**
 * Component for analyzing private GitHub repositories
 *
 * Features:
 * - Accepts repository URL (https://github.com/owner/repo format)
 * - Requires the caller to be signed in to DepVault AND to have connected the
 *   DepVault GitHub App to the org/account that owns the repo (see
 *   GithubAppService) — access to a private repo is granted by installing a
 *   GitHub App with the App's own scoped permissions, never by handing this
 *   product a personal access token.
 * - Calls backend /repo-health/private endpoint with the selected installation id
 * - Displays analysis results with security alerts, vulnerability info, etc.
 * - Handles errors gracefully without exposing sensitive data
 *
 * Security Considerations:
 * - No GitHub credential of any kind ever touches this component or the browser
 * - Only sends requests to internal API endpoints
 * - Sanitizes error responses before displaying to user
 */
@Component({
  selector: 'app-private-repo-analysis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  template: `
    <div class="private-repo-analysis-container">
      <div class="analysis-section">
        <h4>Analyze Private Repository</h4>
        <p class="description">
          Enter the URL of your private GitHub repository to analyze its health, security
          vulnerabilities, and dependencies.
        </p>

        @if (!authService.isAuthenticated()) {
          <div class="alert alert-warning">
            <app-icon iconType="alert" class="alert-icon"></app-icon>
            <span>Sign in to your DepVault account first to analyze private repositories.</span>
          </div>
        } @else if (isLoadingInstallations) {
          <p class="description">Checking your connected GitHub App installations…</p>
        } @else if (installations.length === 0) {
          <div class="alert alert-warning">
            <app-icon iconType="alert" class="alert-icon"></app-icon>
            <span>
              Connect the DepVault GitHub App to the account or organization that owns your private
              repository — DepVault never asks for a personal access token.
            </span>
          </div>
          <button type="button" class="btn btn-primary" [disabled]="isConnectingApp" (click)="connectGithubApp()">
            @if (isConnectingApp) {
              <span class="spinner"></span>
              Redirecting to GitHub…
            } @else {
              <app-icon iconType="github" class="btn-icon"></app-icon>
              Connect GitHub App
            }
          </button>
          @if (connectError) {
            <div class="alert alert-error"><span>{{ connectError }}</span></div>
          }
        } @else {
          <div class="form-group">
            <label for="installation-select">GitHub App Installation</label>
            <select id="installation-select" class="repo-url-input" [(ngModel)]="selectedInstallationId" [ngModelOptions]="{standalone: true}">
              @for (installation of installations; track installation.installationId) {
                <option [value]="installation.installationId">{{ installation.accountLogin || ('Installation #' + installation.installationId) }}</option>
              }
            </select>
          </div>
          <form [formGroup]="analysisForm" (ngSubmit)="onAnalyzePrivateRepo()">
            <div class="form-group">
              <label for="repo-url">Repository URL</label>
              <input
                id="repo-url"
                type="text"
                class="repo-url-input"
                placeholder="https://github.com/owner/private-repo"
                formControlName="repoUrl"
                [disabled]="isAnalyzing"
                aria-label="GitHub repository URL"
              />
              @if (
                analysisForm.get('repoUrl')?.hasError('required') &&
                analysisForm.get('repoUrl')?.touched
              ) {
                <div class="form-error">
                  <app-icon iconType="alert" class="form-error-icon"></app-icon>
                  Repository URL is required
                </div>
              }
              @if (
                analysisForm.get('repoUrl')?.hasError('pattern') &&
                analysisForm.get('repoUrl')?.touched
              ) {
                <div class="form-error">
                  <app-icon iconType="alert" class="form-error-icon"></app-icon>
                  Please enter a valid GitHub URL (e.g., https://github.com/owner/repo)
                </div>
              }
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="!analysisForm.valid || isAnalyzing"
              >
                @if (isAnalyzing) {
                  <span class="spinner"></span>
                  Analyzing...
                } @else {
                  <app-icon iconType="search" class="btn-icon"></app-icon>
                  Analyze Repository
                }
              </button>
            </div>
          </form>

          @if (errorMessage) {
            <div class="alert alert-error">
              <app-icon iconType="alert" class="alert-icon"></app-icon>
              <span>{{ errorMessage }}</span>
            </div>
          }

          @if (analysisResult) {
            <div class="analysis-results">
              <div class="result-card">
                <div class="result-header">
                  <h5>{{ analysisResult.name || 'Repository Analysis' }}</h5>
                  <span class="repo-id">{{ analysisResult.owner }}/{{ analysisResult.repo }}</span>
                </div>

                <div class="result-grid">
                  <div class="result-item">
                    <label>Overall Health</label>
                    <div
                      class="health-score"
                      [ngClass]="'score-' + getHealthLevel(analysisResult.overall_health.score)"
                    >
                      {{ analysisResult.overall_health.score }}%
                    </div>
                  </div>

                  <div class="result-item">
                    <label>Security Alerts</label>
                    <div
                      class="metric-value"
                      [ngClass]="analysisResult.security_alerts > 0 ? 'has-alerts' : 'no-alerts'"
                    >
                      {{ analysisResult.security_alerts || 0 }}
                    </div>
                  </div>

                  <div class="result-item">
                    <label>Stars</label>
                    <div class="metric-value">
                      <app-icon iconType="star" class="metric-icon"></app-icon>
                      {{ analysisResult.stars || 0 }}
                    </div>
                  </div>

                  <div class="result-item">
                    <label>Forks</label>
                    <div class="metric-value">
                      <app-icon iconType="gitfork" class="metric-icon"></app-icon>
                      {{ analysisResult.forks || 0 }}
                    </div>
                  </div>

                  <div class="result-item">
                    <label>Open Issues</label>
                    <div class="metric-value">
                      <app-icon iconType="alert" class="metric-icon"></app-icon>
                      {{ analysisResult.open_issues || 0 }}
                    </div>
                  </div>

                  <div class="result-item">
                    <label>Last Pushed</label>
                    <div class="metric-value">
                      {{ getFormattedDate(analysisResult.last_pushed) }}
                    </div>
                  </div>
                </div>

                @if (
                  analysisResult.security_alert_details &&
                  analysisResult.security_alert_details.length > 0
                ) {
                  <div class="security-alerts-section">
                    <h6>Security Alerts</h6>
                    <div class="alerts-list">
                      @for (
                        alert of analysisResult.security_alert_details.slice(0, 5);
                        track alert.id
                      ) {
                        <div
                          class="alert-item"
                          [ngClass]="'severity-' + (alert.security_advisory.severity || 'unknown').toLowerCase()"
                        >
                          <div class="alert-severity">{{ alert.security_advisory.severity || 'UNKNOWN' }}</div>
                          <div class="alert-details">
                            <div class="alert-type">
                              {{ alert.dependency.package.name || 'Security Alert' }}
                            </div>
                            <div class="alert-description">
                              {{ alert.security_advisory.summary || alert.security_advisory.description || 'No description available' }}
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                    @if (analysisResult.security_alert_details.length > 5) {
                      <div class="more-alerts">
                        +{{ analysisResult.security_alert_details.length - 5 }} more alerts
                      </div>
                    }
                  </div>
                }

                @if (
                  analysisResult.risky_dependencies && analysisResult.risky_dependencies.length > 0
                ) {
                  <div class="dependencies-section">
                    <h6>Risky Dependencies</h6>
                    <div class="dependencies-list">
                      @for (dep of analysisResult.risky_dependencies.slice(0, 5); track dep) {
                        <div class="dependency-item">
                          <div class="dep-name">{{ dep }}</div>
                        </div>
                      }
                    </div>
                    @if (analysisResult.risky_dependencies.length > 5) {
                      <div class="more-deps">
                        +{{ analysisResult.risky_dependencies.length - 5 }} more dependencies
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styleUrl: './private-repo-analysis.css',
})
export class PrivateRepoAnalysisComponent implements OnInit {
  analysisForm: FormGroup;
  isAnalyzing = false;
  errorMessage: string | null = null;
  analysisResult: RepositoryAnalysisResult | null = null;

  installations: GithubAppInstallation[] = [];
  isLoadingInstallations = true;
  selectedInstallationId = '';
  isConnectingApp = false;
  connectError: string | null = null;

  // GitHub URL pattern: https://github.com/owner/repo
  private readonly GITHUB_URL_PATTERN =
    /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;

  constructor(
    private readonly fb: FormBuilder,
    private readonly repoHealthAnalysisService: RepoHealthAnalysisService,
    private readonly githubAppService: GithubAppService,
    public readonly authService: AuthService,
  ) {
    this.analysisForm = this.fb.group({
      repoUrl: ['', [Validators.required, Validators.pattern(this.GITHUB_URL_PATTERN)]],
    });
  }

  ngOnInit(): void {
    this.monitorSession();
    if (this.authService.isAuthenticated()) {
      this.loadInstallations();
    } else {
      this.isLoadingInstallations = false;
    }
  }

  private loadInstallations(): void {
    this.isLoadingInstallations = true;
    this.githubAppService.getMyInstallations().subscribe({
      next: (installations) => {
        this.installations = installations;
        if (installations.length > 0 && !this.selectedInstallationId) {
          this.selectedInstallationId = installations[0].installationId;
        }
        this.isLoadingInstallations = false;
      },
      error: (err) => {
        console.error('Failed to load GitHub App installations', err);
        this.isLoadingInstallations = false;
      },
    });
  }

  connectGithubApp(): void {
    this.isConnectingApp = true;
    this.connectError = null;
    this.githubAppService.getInstallUrl().subscribe({
      next: (res) => {
        window.location.href = res.url;
      },
      error: (err) => {
        this.isConnectingApp = false;
        this.connectError =
          err?.status === 503
            ? 'Private repository analysis is not available yet — the GitHub App is not configured on this server.'
            : 'Failed to start the GitHub App connection. Please try again.';
      },
    });
  }

  /** Session (DepVault JWT) expiration check — this used to reference a stored GitHub token, which no longer exists. */
  private monitorSession(): void {
    setInterval(() => {
      if (!this.authService.isAuthenticated()) {
        this.analysisForm.disable();
        this.errorMessage = 'Your session has expired. Please sign in again.';
      }
    }, 5000);
  }

  /**
   * Analyze private repository
   *
   * Security Flow:
   * 1. Validate repository URL format (client-side)
   * 2. Confirm the caller selected a connected GitHub App installation
   * 3. Call backend /repo-health/private endpoint with the URL + installation id
   * 4. Backend verifies the caller owns that installation, exchanges it for a
   *    short-lived Installation Access Token, and analyzes the repo
   * 5. Display results with alert details
   */
  async onAnalyzePrivateRepo(): Promise<void> {
    if (!this.analysisForm.valid || !this.authService.isAuthenticated() || !this.selectedInstallationId) {
      this.errorMessage = 'Invalid repository URL, authentication, or GitHub App installation required';
      return;
    }

    this.isAnalyzing = true;
    this.errorMessage = null;
    this.analysisResult = null;

    try {
      const repoUrl = this.analysisForm.get('repoUrl')?.value.trim();

      // Call backend endpoint — JWT is automatically injected by AuthInterceptor
      const response = await this.repoHealthAnalysisService
        .analyzePrivateRepository(repoUrl, this.selectedInstallationId)
        .toPromise();

      if (response) {
        this.analysisResult = response;
      }
    } catch (error: any) {
      // Sanitize error message (never expose token details)
      if (error?.status === 401) {
        this.errorMessage = 'Authentication failed. Please check your GitHub token and try again.';
      } else if (error?.status === 403) {
        this.errorMessage =
          'Access denied. You may not have permission to access this private repository.';
      } else if (error?.status === 404) {
        this.errorMessage =
          'Repository not found. Please check the URL and your access permissions.';
      } else if (error?.errorscope?.message) {
        // Use sanitized backend error message
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Failed to analyze repository. Please try again later.';
      }

      // Log error internally (without token)
      console.error('[PrivateRepoAnalysis] Analysis failed:', {
        url: this.analysisForm.get('repoUrl')?.value,
        status: error?.status,
        timestamp: new Date().toISOString(),
      });
    } finally {
      this.isAnalyzing = false;
    }
  }

  /**
   * Get health level label from score (0-100)
   */
  getHealthLevel(score: number | undefined): string {
    if (!score) return 'unknown';
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  /**
   * Format date for display
   */
  getFormattedDate(dateStr: string | undefined): string {
    if (!dateStr) return 'Never';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      if (daysAgo === 0) return 'Today';
      if (daysAgo === 1) return 'Yesterday';
      if (daysAgo < 7) return `${daysAgo} days ago`;
      if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
      if (daysAgo < 365) return `${Math.floor(daysAgo / 30)} months ago`;
      return `${Math.floor(daysAgo / 365)} years ago`;
    } catch {
      return 'Unknown';
    }
  }
}

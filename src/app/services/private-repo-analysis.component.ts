import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '@/environment/environment';

/**
 * Component for analyzing private GitHub repositories
 *
 * Features:
 * - Accepts repository URL (https://github.com/owner/repo format)
 * - Uses stored GitHub token from AuthService (sessionStorage)
 * - Calls backend /repo-health/private endpoint
 * - Displays analysis results with security alerts, vulnerability info, etc.
 * - Handles errors gracefully without exposing sensitive data
 *
 * Security Considerations:
 * - Only uses token when user is authenticated (checked via AuthService.isAuthenticated())
 * - Token never exposed in logs, console, or error messages
 * - Only sends requests to internal API endpoints
 * - Sanitizes error responses before displaying to user
 * - Session-based token is auto-cleared on browser close
 */
@Component({
  selector: 'app-private-repo-analysis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
            <span class="icon">⚠️</span>
            <span>
              You must authenticate with a GitHub token first to analyze private repositories.
              Please set up your GitHub token above.
            </span>
          </div>
        } @else {
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
                <div class="form-error">Repository URL is required</div>
              }
              @if (
                analysisForm.get('repoUrl')?.hasError('pattern') &&
                analysisForm.get('repoUrl')?.touched
              ) {
                <div class="form-error">
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
                  🔍 Analyze Repository
                }
              </button>
            </div>
          </form>

          @if (errorMessage) {
            <div class="alert alert-error">
              <span class="icon">❌</span>
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
                      [ngClass]="'score-' + getHealthLevel(analysisResult.overall_health?.score)"
                    >
                      {{ analysisResult.overall_health?.score || 'N/A' }}%
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
                    <div class="metric-value">⭐ {{ analysisResult.stars || 0 }}</div>
                  </div>

                  <div class="result-item">
                    <label>Forks</label>
                    <div class="metric-value">🔀 {{ analysisResult.forks || 0 }}</div>
                  </div>

                  <div class="result-item">
                    <label>Open Issues</label>
                    <div class="metric-value">⚠️ {{ analysisResult.open_issues || 0 }}</div>
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
                        track alert.event_id
                      ) {
                        <div
                          class="alert-item"
                          [ngClass]="'severity-' + (alert.severity || 'unknown').toLowerCase()"
                        >
                          <div class="alert-severity">{{ alert.severity || 'UNKNOWN' }}</div>
                          <div class="alert-details">
                            <div class="alert-type">
                              {{ alert.type || alert.rule_id || 'Security Alert' }}
                            </div>
                            <div class="alert-description">
                              {{ alert.description || 'No description available' }}
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
                      @for (dep of analysisResult.risky_dependencies.slice(0, 5); track dep.name) {
                        <div class="dependency-item">
                          <div class="dep-name">{{ dep.name || 'Unknown' }}</div>
                          <div class="dep-issue">{{ dep.reason || 'Potential vulnerability' }}</div>
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
  analysisResult: any = null;

  // GitHub URL pattern: https://github.com/owner/repo
  private readonly GITHUB_URL_PATTERN =
    /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    public readonly authService: AuthService,
  ) {
    this.analysisForm = this.fb.group({
      repoUrl: ['', [Validators.required, Validators.pattern(this.GITHUB_URL_PATTERN)]],
    });
  }

  ngOnInit(): void {
    // Monitor token expiration
    this.monitorTokenExpiration();
  }

  /**
   * Monitor token expiration and disable form if token expires
   */
  private monitorTokenExpiration(): void {
    setInterval(() => {
      if (!this.authService.isAuthenticated()) {
        this.analysisForm.disable();
        this.errorMessage = 'Your GitHub token has expired. Please authenticate again.';
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Analyze private repository
   *
   * Security Flow:
   * 1. Validate repository URL format (client-side)
   * 2. Get token from AuthService (sessionStorage-based)
   * 3. Call backend /repo-health/private endpoint with URL and token
   * 4. Backend validates token with GitHub API
   * 5. Backend analyzes private repo (token never exposed in response)
   * 6. Display results with alert details
   */
  async onAnalyzePrivateRepo(): Promise<void> {
    if (!this.analysisForm.valid || !this.authService.isAuthenticated()) {
      this.errorMessage = 'Invalid repository URL or authentication required';
      return;
    }

    this.isAnalyzing = true;
    this.errorMessage = null;
    this.analysisResult = null;

    try {
      const repoUrl = this.analysisForm.get('repoUrl')?.value.trim();

      // Call backend endpoint
      // Token is automatically injected by AuthInterceptor
      const response = await this.http
        .post<any>(`${environment.apiBaseUrl}/repo-health/private`, {
          url: repoUrl,
        })
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

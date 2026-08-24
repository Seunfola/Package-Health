import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { timeout, TimeoutError } from 'rxjs';
import { StatusCard } from '../reusable/status-card/status-card';
import { TrendChart } from '../reusable/charts/trend-chart/trend-chart';
import { Skeleton } from '../reusable/skeleton/skeleton';
import { ScannerService, ScanResult, FixSuggestion } from '../services/scanner.service';

/** A hung scan request (backend accepted the connection but never responded)
 *  can't be told apart from "still working" by isLoading alone — the
 *  "Scanning…" button would spin forever. Bounded so a slow-but-real scan
 *  still has room (Monte Carlo + multiple registry calls), not so long the
 *  user has no signal something's wrong. */
const SCAN_TIMEOUT_MS = 20_000;

interface MetricCard {
  title: string;
  value: string;
  icon: string;
  iconContainerBg: string;
  iconFillColor: string;
  cardBorderRadius: string;
}

type Severity = 'critical' | 'high' | 'medium' | 'low' | 'unknown';

interface ScanFinding {
  id: string;
  severity: Severity;
  summary: string;
  range: string;
}

const ECOSYSTEMS = ['npm', 'pypi', 'cargo'] as const;
type Ecosystem = (typeof ECOSYSTEMS)[number];

/**
 * Real package-lookup tool: an ecosystem select + package-name input that
 * scans a package via ScannerService and renders the resulting TrustScoreResult
 * breakdown, plus fix suggestions / report / SBOM / badge actions against the
 * scanner endpoints (all under `{apiUrl}/scan|sbom|badge/...`).
 */
@Component({
  selector: 'app-repo-health',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusCard, TrendChart, Skeleton],
  templateUrl: './repo-health.html',
  styleUrl: './repo-health.css',
})
export class RepoHealth implements OnInit {
  readonly ecosystems = ECOSYSTEMS;

  ecosystem: Ecosystem = 'npm';
  packageName = 'express';
  version = '';

  isLoading = false;
  errorMessage = '';
  scanResult: ScanResult | null = null;
  statusCards: MetricCard[] = [];
  scanHistory: any[] = [];

  isFetchingFixes = false;
  fixError = '';
  fixSuggestions: FixSuggestion[] | null = null;

  isDownloadingReport = false;
  reportError = '';

  isGeneratingSbom = false;
  sbomError = '';

  isFetchingBadge = false;
  badgeError = '';
  badgeSvg: SafeHtml | null = null;

  constructor(
    private readonly scannerService: ScannerService,
    private readonly sanitizer: DomSanitizer,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Seed with a real scan on load so the page isn't empty (still user-editable/re-runnable).
    this.scan();
  }

  scan(): void {
    const ecosystem = this.ecosystem;
    const packageName = this.packageName.trim();
    if (!packageName) {
      this.errorMessage = 'Enter a package name to scan.';
      return;
    }
    const version = this.version.trim();

    this.isLoading = true;
    this.errorMessage = '';
    this.scanResult = null;
    this.statusCards = [];
    this.scanHistory = [];
    this.resetActionState();

    this.scannerService
      .scanPackage(ecosystem, packageName, version || undefined)
      .pipe(timeout(SCAN_TIMEOUT_MS))
      .subscribe({
        next: (result) => {
          this.scanResult = result;
          this.statusCards = this.buildStatusCards(result);
          this.isLoading = false;
          this.cdr.markForCheck();

          this.scannerService.getScanHistory(ecosystem, result.package).subscribe({
            next: (history) => {
              this.scanHistory = history;
              this.cdr.markForCheck();
            },
            error: () => {
              this.scanHistory = [];
              this.cdr.markForCheck();
            },
          });
        },
        error: (err) => {
          console.error('Failed to scan package', err);
          this.errorMessage =
            err instanceof TimeoutError
              ? 'Scan timed out. The server took too long to respond — try again in a moment.'
              : this.extractErrorMessage(
                  err,
                  'Failed to scan package. Check the ecosystem and package name and try again.',
                );
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  /** Re-runs the last scan — the error banner's Retry action. */
  retryScan(): void {
    this.scan();
  }

  getFixSuggestions(): void {
    if (!this.scanResult) return;
    this.isFetchingFixes = true;
    this.fixError = '';
    this.fixSuggestions = null;

    this.scannerService.getFixSuggestions(this.scanResult.ecosystem, this.scanResult.package).subscribe({
      next: (suggestions) => {
        this.fixSuggestions = suggestions;
        this.isFetchingFixes = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.fixError = this.extractErrorMessage(err, 'Failed to fetch fix suggestions.');
        this.isFetchingFixes = false;
        this.cdr.markForCheck();
      },
    });
  }

  downloadReport(): void {
    if (!this.scanResult) return;
    const { ecosystem, package: packageName } = this.scanResult;
    this.isDownloadingReport = true;
    this.reportError = '';

    this.scannerService.getReport(ecosystem, packageName).subscribe({
      next: (res) => {
        this.triggerDownload(`${packageName}-trust-report.txt`, res.report, 'text/plain');
        this.isDownloadingReport = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.reportError = this.extractErrorMessage(err, 'Failed to generate report.');
        this.isDownloadingReport = false;
        this.cdr.markForCheck();
      },
    });
  }

  generateSbom(): void {
    if (!this.scanResult) return;
    const { ecosystem, package: packageName } = this.scanResult;
    this.isGeneratingSbom = true;
    this.sbomError = '';

    this.scannerService.generateSbom(ecosystem, packageName).subscribe({
      next: (sbom) => {
        this.triggerDownload(`${packageName}-sbom.json`, JSON.stringify(sbom, null, 2), 'application/json');
        this.isGeneratingSbom = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.sbomError = this.extractErrorMessage(err, 'Failed to generate SBOM.');
        this.isGeneratingSbom = false;
        this.cdr.markForCheck();
      },
    });
  }

  getBadge(): void {
    if (!this.scanResult) return;
    const { ecosystem, package: packageName } = this.scanResult;
    this.isFetchingBadge = true;
    this.badgeError = '';
    this.badgeSvg = null;

    this.scannerService.getBadge(ecosystem, packageName).subscribe({
      next: (svg) => {
        this.badgeSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
        this.isFetchingBadge = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.badgeError = this.extractErrorMessage(err, 'Failed to fetch badge.');
        this.isFetchingBadge = false;
        this.cdr.markForCheck();
      },
    });
  }

  get finalScore(): number {
    return this.scanResult?.trustScore.finalScore ?? 0;
  }

  get findings(): ScanFinding[] {
    const vulnerabilities = this.scanResult?.details?.vulnerabilities ?? [];
    return vulnerabilities.map((finding, index) => this.normalizeFinding(finding, index));
  }

  get severityCounts(): Record<Severity, number> {
    const counts: Record<Severity, number> = {
      critical: 0, high: 0, medium: 0, low: 0, unknown: 0,
    };
    for (const finding of this.findings) counts[finding.severity] += 1;
    return counts;
  }

  getSeverityCount(severity: string): number {
    return this.severityCounts[severity as Severity] ?? 0;
  }

  get scanPassed(): boolean {
    return !this.scanResult?.hasCriticalVulnerabilities && this.finalScore >= 80;
  }

  get scanStatusLabel(): string {
    return this.scanPassed ? 'Passed' : 'Needs attention';
  }

  get scanSummary(): string {
    if (!this.scanResult) return '';
    if (this.findings.length === 0) return 'No known vulnerabilities were returned for this package version.';
    return `${this.findings.length} known ${this.findings.length === 1 ? 'vulnerability' : 'vulnerabilities'} need review before adoption.`;
  }

  async copyCiSummary(): Promise<void> {
    if (!this.scanResult) return;
    const { ecosystem, package: packageName, version } = this.scanResult;
    const ci = this.scanResult.trustScore.ci;
    const lines = [
      '## DepVault package scan',
      '',
      `**${this.scanStatusLabel.toUpperCase()}** — ${packageName}@${version} scored ${Math.round(this.finalScore)}/100.`,
      '',
      `- Ecosystem: ${ecosystem}`,
      `- Security score: ${Math.round(this.scanResult.trustScore.securityScore)}/100`,
      `- Vulnerabilities: ${this.findings.length || 'None found'}`,
      ...(ci ? [`- 95% confidence interval: ${Math.round(ci.p2_5)}–${Math.round(ci.p97_5)}`] : []),
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
    } catch {
      this.reportError = 'Could not copy the CI summary. Your browser may block clipboard access.';
    }
  }

  get strokeDashoffset(): number {
    const circumference = 2 * Math.PI * 45; // r=45
    return circumference - (this.finalScore / 100) * circumference;
  }

  getHealthLevel(score: number): 'critical' | 'warning' | 'healthy' {
    if (score < 50) return 'critical';
    if (score < 80) return 'warning';
    return 'healthy';
  }

  private resetActionState(): void {
    this.fixSuggestions = null;
    this.fixError = '';
    this.reportError = '';
    this.sbomError = '';
    this.badgeSvg = null;
    this.badgeError = '';
  }

  private buildStatusCards(result: ScanResult): MetricCard[] {
    const s = result.trustScore;
    return [
      {
        title: 'Security Score',
        value: `${Math.round(s.securityScore)}/100`,
        icon: 'assets/icons/shield.svg',
        iconContainerBg: 'rgba(239, 68, 68, 0.15)',
        iconFillColor: '',
        cardBorderRadius: '12px',
      },
      {
        title: 'License',
        value: `${Math.round(s.subscores.license)}/100`,
        icon: 'assets/icons/scale.svg',
        iconContainerBg: 'rgba(59, 130, 246, 0.15)',
        iconFillColor: '',
        cardBorderRadius: '12px',
      },
      {
        title: 'Maintenance (adj.)',
        value: `${Math.round(s.subscores.adjustedMaintenance)}/100`,
        icon: 'assets/icons/activity.svg',
        iconContainerBg: 'rgba(34, 197, 94, 0.15)',
        iconFillColor: '',
        cardBorderRadius: '12px',
      },
      {
        title: 'Popularity',
        value: `${Math.round(s.subscores.popularity)}/100`,
        icon: 'assets/icons/star.svg',
        iconContainerBg: 'rgba(234, 179, 8, 0.15)',
        iconFillColor: '',
        cardBorderRadius: '12px',
      },
      {
        title: 'Freshness',
        value: `${Math.round(s.freshness * 100)}%`,
        icon: 'assets/icons/clock.svg',
        iconContainerBg: 'rgba(168, 85, 247, 0.15)',
        iconFillColor: '',
        cardBorderRadius: '12px',
      },
    ];
  }

  private normalizeFinding(finding: Record<string, unknown>, index: number): ScanFinding {
    const databaseSpecific = finding['database_specific'] as Record<string, unknown> | undefined;
    const aliases = finding['aliases'] as unknown[] | undefined;
    const rawSeverity = String(finding['severity'] ?? databaseSpecific?.['severity'] ?? 'unknown').toLowerCase();
    const severity: Severity = ['critical', 'high', 'medium', 'low'].includes(rawSeverity)
      ? rawSeverity as Severity
      : 'unknown';
    return {
      id: String(finding['id'] ?? finding['ghsa_id'] ?? aliases?.[0] ?? `Finding ${index + 1}`),
      severity,
      summary: String(finding['summary'] ?? finding['details'] ?? finding['description'] ?? 'Known vulnerability'),
      range: String(finding['vulnerable_version_range'] ?? finding['affected_range'] ?? finding['range'] ?? 'Version range unavailable'),
    };
  }

  private triggerDownload(filename: string, content: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private extractErrorMessage(err: any, fallback: string): string {
    // AuthInterceptor's sanitizeError() rewrites 401/403/429/409/network
    // (status 0) failures into a plain string on `err.error` (not a
    // `{ message }` object) — check that form too, or those already-clear
    // messages get discarded in favor of this generic fallback.
    if (typeof err?.error === 'string' && err.error) {
      return err.error;
    }
    const backendMessage = err?.error?.message;
    if (backendMessage) {
      return Array.isArray(backendMessage) ? backendMessage.join(', ') : String(backendMessage);
    }
    if (err?.status === 404) {
      return 'Package not found in this ecosystem.';
    }
    if (err?.status === 400) {
      return 'Invalid ecosystem or package name.';
    }
    return fallback;
  }
}

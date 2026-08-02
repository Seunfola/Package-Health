import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StatusCard } from '../reusable/status-card/status-card';
import { TrendChart } from '../reusable/charts/trend-chart/trend-chart';
import { ScannerService, ScanResult, FixSuggestion } from '../services/scanner.service';

interface MetricCard {
  title: string;
  value: string;
  icon: string;
  iconContainerBg: string;
  iconFillColor: string;
  cardBorderRadius: string;
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
  imports: [CommonModule, FormsModule, StatusCard, TrendChart],
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

    this.scannerService.scanPackage(ecosystem, packageName, version || undefined).subscribe({
      next: (result) => {
        this.scanResult = result;
        this.statusCards = this.buildStatusCards(result);
        this.isLoading = false;

        this.scannerService.getScanHistory(ecosystem, result.package).subscribe({
          next: (history) => (this.scanHistory = history),
          error: () => (this.scanHistory = []),
        });
      },
      error: (err) => {
        console.error('Failed to scan package', err);
        this.errorMessage = this.extractErrorMessage(
          err,
          'Failed to scan package. Check the ecosystem and package name and try again.',
        );
        this.isLoading = false;
      },
    });
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
      },
      error: (err) => {
        this.fixError = this.extractErrorMessage(err, 'Failed to fetch fix suggestions.');
        this.isFetchingFixes = false;
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
      },
      error: (err) => {
        this.reportError = this.extractErrorMessage(err, 'Failed to generate report.');
        this.isDownloadingReport = false;
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
      },
      error: (err) => {
        this.sbomError = this.extractErrorMessage(err, 'Failed to generate SBOM.');
        this.isGeneratingSbom = false;
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
      },
      error: (err) => {
        this.badgeError = this.extractErrorMessage(err, 'Failed to fetch badge.');
        this.isFetchingBadge = false;
      },
    });
  }

  get finalScore(): number {
    return this.scanResult?.trustScore.finalScore ?? 0;
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
        iconFillColor: 'invert(100%)',
        cardBorderRadius: '12px',
      },
      {
        title: 'License',
        value: `${Math.round(s.subscores.license)}/100`,
        icon: 'assets/icons/scale.svg',
        iconContainerBg: 'rgba(59, 130, 246, 0.15)',
        iconFillColor: 'invert(100%)',
        cardBorderRadius: '12px',
      },
      {
        title: 'Maintenance (adj.)',
        value: `${Math.round(s.subscores.adjustedMaintenance)}/100`,
        icon: 'assets/icons/activity.svg',
        iconContainerBg: 'rgba(34, 197, 94, 0.15)',
        iconFillColor: 'invert(100%)',
        cardBorderRadius: '12px',
      },
      {
        title: 'Popularity',
        value: `${Math.round(s.subscores.popularity)}/100`,
        icon: 'assets/icons/star.svg',
        iconContainerBg: 'rgba(234, 179, 8, 0.15)',
        iconFillColor: 'invert(100%)',
        cardBorderRadius: '12px',
      },
      {
        title: 'Freshness',
        value: `${Math.round(s.freshness * 100)}%`,
        icon: 'assets/icons/clock.svg',
        iconContainerBg: 'rgba(168, 85, 247, 0.15)',
        iconFillColor: 'invert(100%)',
        cardBorderRadius: '12px',
      },
    ];
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

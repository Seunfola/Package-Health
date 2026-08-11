import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { RepoDetailsDash } from './repo-details-dash/repo-details-dash';
import { ChartCard } from './git-graph/chart-card/chart-card';
import { LineChart } from './line-chart/line-chart';
import { CodeQualityMetrics } from './code-quality-metrics/code-quality-metrics';
import { SecurityAlerts } from './security-alerts/security-alerts';
import { LeakFindings } from './leak-findings/leak-findings';
import { AnalysisData, RepoService } from '../services/RepoService';
import { LeakGuardScanResult, LeakGuardService } from '../services/leak-guard.service';
import { NotificationService } from '../services/notification.service';
import { AnalysisService } from '../services/analysis.service';
import { RepositoryAnalysisResult } from '../services/repo-health-analysis.service';
import { ContributionGraph } from './git-graph/contribution-graph/contribution-graph';
import { DependencyGraph } from './dependency-graph/dependency-graph';
import { EmptyStateCard } from '../reusable/empty-state-card/empty-state-card';

@Component({
  selector: 'app-repo-details',
  standalone: true,
  imports: [
    CommonModule,
    RepoDetailsDash,
    ChartCard,
    LineChart,
    CodeQualityMetrics,
    SecurityAlerts,
    LeakFindings,
    ContributionGraph,
    DependencyGraph,
    EmptyStateCard,
  ],
  templateUrl: './repo-details.html',
  styleUrls: ['./repo-details.css'],
})
export class RepoDetails implements OnInit {
  analysisData: AnalysisData | null = null;
  /** Set on a failed fetch (as opposed to "no repo selected") so the empty state can say what actually happened. */
  loadError: string | null = null;

  /**
   * A one-off result from the homepage's quick-analyze widget (paste JSON,
   * upload a file, or a GitHub URL scan) — set only when there's no
   * owner/name route param to fetch a stored record by. This is a
   * different, flatter shape than `analysisData` (no commit history —
   * there's no git log for a pasted package.json), so it renders through
   * its own template block rather than being force-fit into the full
   * dashboard below.
   */
  ephemeralResult: RepositoryAnalysisResult | null = null;

  /** Null while loading AND when no LeakGuard scan has ever been uploaded for this repo — the 404 case is expected, not an error, since syncing is opt-in. */
  leakScan: LeakGuardScanResult | null = null;
  leakScanLoading = true;
  /** Set only on a genuine fetch failure (network/5xx) — a 404 is the expected "never synced" case and must not set this, or a real outage would misreport as "no scan uploaded yet". */
  leakScanError: string | null = null;

  private ownerParam = '';
  private repoParam = '';
  isGeneratingNotifications = false;
  generateNotificationsMessage: string | null = null;

  public commitData: ChartConfiguration<'line'>['data'] = {
    datasets: [
      {
        data: [],
        label: 'Commits',
        borderColor: '#16A34A',
        pointBackgroundColor: '#16A34A',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#16A34A',
        fill: 'origin',
        tension: 0.4,
      },
    ],
    labels: [],
  };

  public commitOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { line: { borderWidth: 2 }, point: { radius: 4, hoverRadius: 6 } },
    scales: {
      x: { ticks: { color: '#374151' } },
      y: { beginAtZero: true, grid: { color: '#E5E7EB' } },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { boxWidth: 10, padding: 20, color: '#374151' },
      },
    },
  };

  public lineChartType: ChartType = 'line';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly repoService: RepoService,
    private readonly leakGuardService: LeakGuardService,
    private readonly notificationService: NotificationService,
    private readonly analysisService: AnalysisService,
  ) {}

  ngOnInit() {
    const owner = this.route.snapshot.paramMap.get('owner');
    const name = this.route.snapshot.paramMap.get('name');

    if (!owner || !name) {
      // No route params — check for an ephemeral result handed off by the
      // homepage's quick-analyze widget. Shown once, then cleared, so a
      // later direct visit to this bare URL doesn't show stale data.
      const ephemeral = this.analysisService.getAnalysis();
      if (ephemeral) {
        this.ephemeralResult = ephemeral;
        this.analysisService.clear();
      }
      return;
    }

    this.ownerParam = owner;
    this.repoParam = name;
    this.repoService.getAnalysisData(owner, name).subscribe({
      next: (data) => {
        this.analysisData = data;
        this.initializeChartData();
      },
      error: (err) => {
        console.error('Error fetching repo:', err);
        this.analysisData = null;
        this.loadError = 'Failed to load repository analysis. Please try again.';
      },
    });

    this.leakGuardService
      .getLeakScan(owner, name)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status !== 404) {
            console.error('Error fetching LeakGuard scan:', err);
            this.leakScanError = 'Failed to load LeakGuard scan results.';
          }
          return of(null);
        }),
      )
      .subscribe((scan) => {
        this.leakScan = scan;
        this.leakScanLoading = false;
      });
  }

  getHealthLevel(score: number | undefined): 'excellent' | 'good' | 'moderate' | 'poor' {
    const s = score ?? 0;
    if (s >= 80) return 'excellent';
    if (s >= 60) return 'good';
    if (s >= 40) return 'moderate';
    return 'poor';
  }

  returnToDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }

  generateNotifications(): void {
    if (!this.ownerParam || !this.repoParam) return;
    this.isGeneratingNotifications = true;
    this.generateNotificationsMessage = null;

    this.notificationService.generateForRepository(this.ownerParam, this.repoParam).subscribe({
      next: (res) => {
        this.isGeneratingNotifications = false;
        this.generateNotificationsMessage =
          res.generated > 0
            ? `Generated ${res.generated} notification${res.generated === 1 ? '' : 's'} — check your Notifications page.`
            : 'No new notifications to generate — everything is already up to date.';
      },
      error: (err) => {
        console.error('Failed to generate notifications:', err);
        this.isGeneratingNotifications = false;
        this.generateNotificationsMessage = 'Failed to generate notifications.';
      },
    });
  }

  initializeChartData() {
    if (!this.analysisData) return;

    this.commitData = {
      datasets: [
        {
          data: this.analysisData.commitData || [],
          label: 'Commits',
          borderColor: '#16A34A',
          pointBackgroundColor: '#16A34A',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#16A34A',
          fill: 'origin',
          tension: 0.4,
        },
      ],
      labels: this.analysisData.commitLabels || [],
    };
  }
}

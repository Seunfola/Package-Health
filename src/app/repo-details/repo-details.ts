import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { RepoDetailsDash } from './repo-details-dash/repo-details-dash';
import { ChartCard } from './git-graph/chart-card/chart-card';
import { LineChart } from './line-chart/line-chart';
import { CodeQualityMetrics } from './code-quality-metrics/code-quality-metrics';
import { SecurityAlerts } from './security-alerts/security-alerts';
import { AnalysisData, RepoService } from '../services/RepoService';
import { ContributionGraph } from './git-graph/contribution-graph/contribution-graph';
import { DependencyGraph } from './dependency-graph/dependency-graph';

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
    ContributionGraph,
    DependencyGraph,
  ],
  templateUrl: './repo-details.html',
  styleUrls: ['./repo-details.css'],
})
export class RepoDetails implements OnInit {
  analysisData: AnalysisData | null = null;
  /** Set on a failed fetch (as opposed to "no repo selected") so the empty state can say what actually happened. */
  loadError: string | null = null;

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
  ) {}

  ngOnInit() {
    const owner = this.route.snapshot.paramMap.get('owner');
    const name = this.route.snapshot.paramMap.get('name');

    if (owner && name) {
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
    }
    // No owner/name in the route: analysisData stays null and the template's
    // "No repository data available" empty state renders — no fake data.
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

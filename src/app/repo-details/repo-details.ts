import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { RepoDetailsDash } from './repo-details-dash/repo-details-dash';
import { ContributionGraph } from './git-graph/git-graph';
import { ChartCard } from './git-graph/chart-card/chart-card';
import { LineChart } from './line-chart/line-chart';
import { CodeQualityMetrics } from './code-quality-metrics/code-quality-metrics';
import { SecurityAlerts } from './security-alerts/security-alerts';
import { AnalysisData, RepoService } from '../services/RepoService';

@Component({
  selector: 'app-repo-details',
  standalone: true,
  imports: [
    CommonModule,
    RepoDetailsDash,
    ChartCard,
    ContributionGraph,
    LineChart,
    CodeQualityMetrics,
    SecurityAlerts,
  ],
  templateUrl: './repo-details.html',
  styleUrls: ['./repo-details.css'],
})
export class RepoDetails implements OnInit {
  analysisData: AnalysisData | null = null;
  contributionData: { date: string; count: number }[] = [];

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
        labels: { boxWidth: 10, padding: 20, color: '#fff' },
      },
    },
  };

  public lineChartType: ChartType = 'line';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repoService: RepoService,
  ) {}

  ngOnInit() {
    const owner = this.route.snapshot.paramMap.get('owner');
    const name = this.route.snapshot.paramMap.get('name');

    if (owner && name) {
      // Fetch live data
      this.repoService.getAnalysisData(owner, name).subscribe({
        next: (data) => {
          this.analysisData = data;
          this.initializeChartData();
        },
        error: (err) => {
          console.error('Error fetching repo:', err);
          this.loadDefaultData();
        },
      });
    } else {
      // load default
      this.loadDefaultData();
    }
  }

  loadDefaultData() {
    this.analysisData = {
      repoName: 'PackageHealth/Example-Repo',
      stars: 2400,
      forks: 320,
      lastCommit: '2025-10-20',
      openChecks: 3,
      contributionData: this.generateYearlyData(),
      commitData: [120, 140, 75, 200, 130, 250, 190, 220, 150, 200],
      commitLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      overallHealth: 87,
    };

    this.initializeChartData();
  }

  initializeChartData() {
    if (!this.analysisData) return;

    this.contributionData = this.analysisData.contributionData || this.generateYearlyData();

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

  generateYearlyData() {
    const data = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      data.push({ date: d.toISOString().split('T')[0], count: Math.floor(Math.random() * 20) });
    }
    return data;
  }
}

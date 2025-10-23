import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RepoDetailsDash } from './repo-details-dash/repo-details-dash';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { ContributionGraph } from './git-graph/git-graph';
import { ChartCard } from './git-graph/chart-card/chart-card';
import { LineChart } from './line-chart/line-chart';
import { CodeQualityMetrics } from './code-quality-metrics/code-quality-metrics';
import { SecurityAlerts } from './security-alerts/security-alerts';

@Component({
  selector: 'app-repo-details',
  standalone: true,
  imports: [
    RepoDetailsDash,
    CommonModule,
    ChartCard,
    ContributionGraph,
    LineChart,
    CodeQualityMetrics,
    SecurityAlerts,
  ],
  templateUrl: './repo-details.html',
  styleUrls: ['./repo-details.css'], // fixed typo
})
export class RepoDetails implements OnInit {
  analysisData: any = null; // will store dynamic data

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
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 4, hoverRadius: 6 },
    },
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

  constructor(private router: Router) {}

  ngOnInit() {
    // Grab the state passed from HeroSection
    this.analysisData = history.state.analysisData;

    if (!this.analysisData) {
      // Redirect home if no data
      this.router.navigate(['/']);
      return;
    }

    // Set contribution & commit data if available
    this.contributionData = this.analysisData.contributionData || this.generateYearlyData();
    this.commitData = {
      datasets: [
        {
          data: this.analysisData.commitData || [120, 140, 75, 200, 130, 250, 190, 220, 150, 200],
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
      labels: this.analysisData.commitLabels || [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
      ],
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

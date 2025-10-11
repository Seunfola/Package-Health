import { Component, Input, OnInit } from '@angular/core';
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
  styleUrl: './repo-details.css',
})
export class RepoDetails implements OnInit {
  @Input() repoTitle: string = 'PackageHealth/React-dashboard';

  contributionData: { date: string; count: number }[] = [];

  dependencyData = {
    nodes: [
      { id: 'package-a', group: 1, type: 'safe' },
      { id: 'package-b', group: 1, type: 'vulnerable' },
      { id: 'module-x', group: 2, type: 'safe' },
      { id: 'module-y', group: 2, type: 'critical' },
      { id: 'library-z', group: 3, type: 'safe' },
      { id: 'utility-fn', group: 2, type: 'safe' },
      { id: 'plugin-p', group: 3, type: 'vulnerable' },
      { id: 'plugin-q', group: 3, type: 'safe' },
      { id: 'component-c', group: 4, type: 'safe' },
      { id: 'component-d', group: 4, type: 'critical' },
      { id: 'api-service', group: 5, type: 'safe' },
      { id: 'database-lib', group: 5, type: 'safe' },
      { id: 'auth-middleware', group: 6, type: 'vulnerable' },
      { id: 'styling-lib', group: 7, type: 'safe' },
    ],
    links: [
      { source: 'package-a', target: 'module-x' },
      { source: 'package-a', target: 'module-y' },
      { source: 'package-b', target: 'module-x' },
      { source: 'module-x', target: 'library-z' },
      { source: 'package-a', target: 'utility-fn' },
      { source: 'module-x', target: 'plugin-p' },
      { source: 'module-x', target: 'plugin-q' },
      { source: 'plugin-p', target: 'component-c' },
      { source: 'plugin-q', target: 'component-c' },
      { source: 'component-c', target: 'api-service' },
      { source: 'component-d', target: 'api-service' },
      { source: 'api-service', target: 'database-lib' },
      { source: 'component-c', target: 'auth-middleware' },
      { source: 'component-d', target: 'auth-middleware' },
      { source: 'package-a', target: 'styling-lib' },
      { source: 'component-c', target: 'styling-lib' },
    ],
  };

  public commitData: ChartConfiguration<'line'>['data'] = {
    datasets: [
      {
        data: [120, 140, 75, 200, 130, 250, 190, 220, 150, 200],
        label: 'Commits',
        borderColor: '#16A34A',
        // backgroundColor: 'rgba(22, 163, 74, 0.2)',
        pointBackgroundColor: '#16A34A',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#16A34A',
        fill: 'origin',
        tension: 0.4,
      },
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  };

  public commitOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 4, hoverRadius: 6 },
    },
    scales: {
      x: {
        ticks: { color: '#374151' },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#E5E7EB' },
      },
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

  ngOnInit() {
    this.contributionData = this.generateYearlyData();
  }

  generateYearlyData() {
    const data = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    for (let d = oneYearAgo; d <= today; d.setDate(d.getDate() + 1)) {
      data.push({
        date: d.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 20),
      });
    }
    return data;
  }
}

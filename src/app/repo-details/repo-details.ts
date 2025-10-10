import { Component, Input, OnInit } from '@angular/core';
import { RepoDetailsDash } from './repo-details-dash/repo-details-dash';
import { CommonModule } from '@angular/common';
import { ChartCard } from './git-graph/chart-card/chart-card';
import { ContributionGraph } from './git-graph/git-graph';


@Component({
  selector: 'app-repo-details',
  standalone: true,
  imports: [RepoDetailsDash, CommonModule, ChartCard, ContributionGraph],
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

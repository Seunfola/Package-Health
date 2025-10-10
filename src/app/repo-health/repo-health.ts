import { Component } from '@angular/core';
import { StatusCard } from '../reusable/status-card/status-card';
import { CommonModule } from '@angular/common';
import { CommitActivityChart } from '../reusable/charts/commit-activity-chart/commit-activity-chart';
import { DependencyUpdateChart } from '../reusable/charts/dependency-update-chart/dependency-update-chart';
import { IssueResolutionChart } from '../reusable/charts/issue-resolution-chart/issue-resolution-chart';

@Component({
  selector: 'app-repo-health',
  standalone: true,
  imports: [
    StatusCard,
    CommonModule,
    CommitActivityChart,
    DependencyUpdateChart,
    IssueResolutionChart,
  ],
  templateUrl: './repo-health.html',
  styleUrl: './repo-health.css',
})
export class RepoHealth {
  statusCards = [
    {
      title: 'Health Score',
      value: '92/100',
      icon: 'assets/icons/scale.svg',
      iconContainerBg: '#F59E0B33',
      iconFillColor:
        'invert(87%) sepia(31%) saturate(285%) hue-rotate(346deg) brightness(101%) contrast(92%)',
      cardBorderRadius: '10px',
    },
    {
      title: 'Open Issues',
      value: '14',
      icon: 'assets/icons/bug.svg',
      iconContainerBg: '#CB525233',
      iconFillColor: 'invert(100%)',
      cardBorderRadius: '6px',
    },
    {
      title: 'Pull Requests',
      value: '7',
      icon: 'assets/icons/gitpull.svg',
      iconContainerBg: '#007A7A33',
      iconFillColor: 'invert(100%)',
      cardBorderRadius: '6px',
    },
    {
      title: 'Contributors',
      value: '28',
      icon: 'assets/icons/users.svg',
      iconContainerBg: '#E08F4D33',
      iconFillColor: 'invert(100%)',
      cardBorderRadius: '6px',
    },
    {
      title: 'Stars',
      value: '1.2K',
      icon: 'assets/icons/star.svg',
      iconContainerBg: '#F59E0B33',
      iconFillColor:
        'invert(79%) sepia(8%) saturate(3015%) hue-rotate(5deg) brightness(98%) contrast(91%)',
      cardBorderRadius: '6px',
    },
    {
      title: 'Forks',
      value: '156',
      icon: 'assets/icons/gitfork.svg',
      iconContainerBg: '#0EA5E933',
      iconFillColor: 'invert(100%)',
      cardBorderRadius: '6px',
    },
  ];
}

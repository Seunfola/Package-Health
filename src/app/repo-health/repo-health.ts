import { Component } from '@angular/core';
import { StatusCard } from '../reusable/status-card/status-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repo-health',
  standalone: true,
  imports: [StatusCard, CommonModule],
  templateUrl: './repo-health.html',
  styleUrl: './repo-health.css',
})
export class RepoHealth {
  statusCards = [
    { title: 'Health Score', value: '92/100', icon: 'assets/icons/health-score.svg' },
    { title: 'Open Issues', value: '14', icon: 'assets/icons/open-issues.svg' },
    { title: 'Pull Requests', value: '7', icon: 'assets/icons/pull-requests.svg' },
    { title: 'Contributors', value: '28', icon: 'assets/icons/contributors.svg' },
    { title: 'Stars', value: '1.2K', icon: 'assets/icons/stars.svg' },
    { title: 'Forks', value: '156', icon: 'assets/icons/forks.svg' },
  ];
}

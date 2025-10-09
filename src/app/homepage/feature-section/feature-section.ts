import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InsightCard } from '../../insight-card/insight-card';

@Component({
  selector: 'app-feature-section',
  standalone: true,
  imports: [CommonModule, InsightCard],
  templateUrl: './feature-section.html',
  styleUrl: './feature-section.css',
})
export class FeatureSection {
  insights = [
    {
      title: 'Repositories Monitored',
      value: '240+',
      description: 'Actively tracking a diverse portfolio of projects.',
      icon: 'assets/icons/gitbranch.svg'
    },
    {
      title: 'Critical Vulnerabilities',
      value: '12',
      description: 'Identified and mitigated across all managed repositories.',
      icon: 'assets/icons/shield.svg'
    },
    {
      title: 'Dependency Updates',
      value: '300+',
      description: 'Recommended and implemented for enhanced project security.',
      icon: 'assets/icons/refresh.svg'
    },
    {
      title: 'Average Health Score',
      value: '92%',
      description: 'Consistently high code quality maintained by our platform.',
      icon: 'assets/icons/chart.svg'
    }
  ];
}

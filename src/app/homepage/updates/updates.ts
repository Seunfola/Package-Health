import { CommonModule } from '@angular/common';
import { Component, } from '@angular/core';
import { PackageHealthCard } from '../../reusable/package-health-card/package-health-card';

@Component({
  selector: 'app-updates',
  imports: [CommonModule, PackageHealthCard],
  standalone: true,
  templateUrl: './updates.html',
  styleUrls: ['./updates.css'],
})
export class Updates {
  features = [
    {
      title: 'Automated Code Analysis',
      description:
        'Automatically scan your repositories for code quality, security vulnerabilities, and adherence to best practices.',
      icon: 'assets/icons/code.svg',
    },
    {
      title: 'Dependency Insights',
      description:
        "Understand your project's dependency tree, identify outdated packages, and manage risks with clear visualizations.",
      icon: 'assets/icons/gitfork.svg',
    },
    {
      title: 'Performance Monitoring',
      description:
        'Track key performance metrics over time to ensure your projects remain efficient and scalable.',
      icon: 'assets/icons/activity.svg',
    },
    {
      title: 'Actionable Reports',
      description:
        'Generate comprehensive reports with actionable recommendations to improve repository health.',
      icon: 'assets/icons/file.svg',
    },
  ];
}

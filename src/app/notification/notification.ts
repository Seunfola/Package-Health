import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationItem } from './notification-item/notification-item';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, NotificationItem, ],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification {
  notifications = [
    {
      type: 'Security Vulnerability',
      title: "High severity vulnerability detected in 'lodash'",
      repository: 'PackageHealth/FrontendApp',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      iconType: 'alert',
    },
    {
      type: 'Dependency Update',
      title: "New version of 'react' available (V18.2.0)",
      repository: 'PackageHealth/FrontendApp',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      iconType: 'gitfork',
    },
    {
      type: 'New Issue',
      title: 'Issue #123: Dashboard chart not loading data created',
      repository: 'PackageHealth/AnalyticsService',
      time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      iconType: 'bug',
    },
    {
      type: 'Pull Request',
      title: "PR #56: 'Feature/user-profile-enhancements' reviewed",
      repository: 'PackageHealth/BackendApi',
      time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      iconType: 'gitpull',
    },
    {
      type: 'System Alert',
      title: "Repository 'PackageHealth/Docs' health score dropped below 70%",
      repository: 'PackageHealth/Docs',
      time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      iconType: 'notification',
    },
    {
      type: 'Security Vulnerability',
      title: "Critical dependency 'minimist' needs urgent update",
      repository: 'PackageHealth/SharedComponents',
      time: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      iconType: 'alert',
    },
    {
      type: 'Dependency Update',
      title: "Minor update for 'tailwindcss' available",
      repository: 'PackageHealth/MarketingSite',
      time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      iconType: 'gitfork',
    },
  ];
}

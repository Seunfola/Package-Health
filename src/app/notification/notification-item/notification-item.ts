import { IconComponent } from '@/app/shared/icon/icon';
import { CommonModule, NgClass } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule, NgClass, IconComponent],
  templateUrl: './notification-item.html',
  styleUrl: './notification-item.css',
})
export class NotificationItem implements OnChanges {
  @Input() type: string = '';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() time: Date | null = null;
  @Input() repository: string = '';
  @Input() severity: string = '';
  @Input() iconType: string = '';

  formattedTime: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['time'] && this.time) {
      this.formattedTime = this.formatRelativeTime(this.time);
    }
  }

  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (weeks < 4) {
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }

  get typeClass(): string {
    switch (this.type) {
      case 'Security Vulnerability':
        return 'security-vulnerability';
      case 'Dependency Update':
        return 'dependency-update';
      case 'New Issue':
        return 'new-issue';
      case 'Pull Request':
        return 'pull-request';
      case 'System Alert':
        return 'system-alert';
      default:
        return '';
    }
  }

}

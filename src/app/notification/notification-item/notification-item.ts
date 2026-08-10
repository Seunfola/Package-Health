import { IconComponent } from '@/app/shared/icon/icon';
import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule, NgClass, IconComponent],
  templateUrl: './notification-item.html',
  styleUrl: './notification-item.css',
})
export class NotificationItem implements OnChanges {
  /** Raw backend enum value, e.g. `SECURITY_VULNERABILITY` — drives `typeClass`; use `typeLabel` for display. */
  @Input() type: string = '';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() time: Date | null = null;
  @Input() repository: string = '';
  @Input() severity: string = '';
  @Input() iconType: string = '';
  @Input() isRead: boolean = false;
  @Input() detailsUrl?: string;

  /** Emitted when "Dismiss" is clicked — the parent owns the actual delete call. */
  @Output() dismiss = new EventEmitter<void>();

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

  // `type` is the raw backend enum (NOTIFICATION_TYPES in notification.constants.ts)
  // — SECURITY_VULNERABILITY, not "Security Vulnerability". These switches
  // previously matched human-readable strings the API never actually sends,
  // so typeClass silently never applied and the banner showed the raw enum.
  get typeClass(): string {
    switch (this.type) {
      case 'SECURITY_VULNERABILITY':
        return 'security-vulnerability';
      case 'SECURITY_ALERT':
        return 'security-vulnerability';
      case 'DEPENDENCY_UPDATE':
        return 'dependency-update';
      case 'NEW_ISSUE':
        return 'new-issue';
      case 'PULL_REQUEST':
        return 'pull-request';
      case 'SYSTEM_ALERT':
        return 'system-alert';
      default:
        return '';
    }
  }

  get typeLabel(): string {
    return this.type
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  onDismiss(event: Event): void {
    event.stopPropagation();
    this.dismiss.emit();
  }

  onViewDetails(event: Event): void {
    event.stopPropagation();
    if (this.detailsUrl) window.open(this.detailsUrl, '_blank', 'noopener,noreferrer');
  }

}

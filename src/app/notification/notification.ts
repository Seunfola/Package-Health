import { Component, OnInit } from '@angular/core';
import { NotificationItem as NotificationItemComponent } from './notification-item/notification-item';
import { NotificationService, NotificationResponse } from '@/app/services/notification.service';
import { AuthService } from '@/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { UnauthorizedWarning } from '@/app/shared/unauthorized-warning/unauthorized-warning';
import { EmptyStateCard } from '@/app/reusable/empty-state-card/empty-state-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, NotificationItemComponent, UnauthorizedWarning, EmptyStateCard, RouterLink],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit {
  notifications: any[] = [];
  isLoading = true;
  error = '';
  activeFilter: 'all' | 'unread' | 'security' = 'all';

  constructor(
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService
  ) {}

  get authState$() {
    return this.authService.authState$;
  }

  get filteredNotifications(): any[] {
    if (this.activeFilter === 'unread') return this.notifications.filter(notification => !notification.isRead);
    if (this.activeFilter === 'security') return this.notifications.filter(notification => notification.iconType === 'alert');
    return this.notifications;
  }

  get unreadCount(): number { return this.notifications.filter(notification => !notification.isRead).length; }

  setFilter(filter: 'all' | 'unread' | 'security'): void { this.activeFilter = filter; }

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data.map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          repository: n.repository || 'System',
          time: new Date(n.createdAt),
          iconType: this.getIconType(n.type),
          isRead: n.isRead
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching notifications:', err);
        this.error = 'Failed to load notifications.';
        this.isLoading = false;
      }
    });
  }

  getIconType(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('security') || t.includes('vulnerability')) return 'alert';
    if (t.includes('dependency') || t.includes('update')) return 'gitfork';
    if (t.includes('issue')) return 'bug';
    if (t.includes('pull request') || t.includes('pr')) return 'gitpull';
    return 'notification';
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) notif.isRead = true;
      },
      error: (err) => console.error('Error marking as read:', err)
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
      },
      error: (err) => console.error('Error marking all as read:', err)
    });
  }
}

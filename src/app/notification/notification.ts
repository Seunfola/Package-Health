import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationItem as NotificationItemComponent } from './notification-item/notification-item';
import { NotificationService, NotificationResponse } from '@/app/services/notification.service';
import { AuthService } from '@/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { UnauthorizedWarning } from '@/app/shared/unauthorized-warning/unauthorized-warning';
import { EmptyStateCard } from '@/app/reusable/empty-state-card/empty-state-card';
import { ErrorStateCard } from '@/app/reusable/error-state-card/error-state-card';
import { Skeleton } from '@/app/reusable/skeleton/skeleton';
import { RouterLink } from '@angular/router';

interface NotificationViewModel {
  id: string;
  type: string;
  title: string;
  repository: string;
  time: Date;
  iconType: string;
  isRead: boolean;
  detailsUrl?: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationItemComponent, UnauthorizedWarning, EmptyStateCard, ErrorStateCard, Skeleton, RouterLink],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit {
  notifications: NotificationViewModel[] = [];
  isLoading = true;
  error = '';
  activeFilter: 'all' | 'unread' | 'security' = 'all';

  /** Authoritative server-side count — the loaded page may not include every unread notification. */
  unreadCount = 0;

  searchTerm = '';
  isSearching = false;

  selectedIds = new Set<string>();
  isBusy = false;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  get authState$() {
    return this.authService.authState$;
  }

  get filteredNotifications(): NotificationViewModel[] {
    if (this.activeFilter === 'unread') return this.notifications.filter((n) => !n.isRead);
    if (this.activeFilter === 'security') return this.notifications.filter((n) => n.iconType === 'alert');
    return this.notifications;
  }

  get hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

  setFilter(filter: 'all' | 'unread' | 'security'): void {
    this.activeFilter = filter;
  }

  ngOnInit(): void {
    this.fetchNotifications();
    this.refreshUnreadCount();
  }

  private toViewModel(n: NotificationResponse): NotificationViewModel {
    return {
      id: n._id,
      type: n.type,
      title: n.title,
      repository: n.repository || 'System',
      time: new Date(n.createdAt),
      iconType: this.getIconType(n.type),
      isRead: n.read,
      detailsUrl: n.detailsUrl,
    };
  }

  fetchNotifications(): void {
    this.isLoading = true;
    this.error = '';
    this.notificationService.getNotifications({ limit: 50 }).subscribe({
      next: (data) => {
        this.notifications = data.map((n) => this.toViewModel(n));
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching notifications:', err);
        this.error = 'Failed to load notifications.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  refreshUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount = res.count;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to fetch unread count', err),
    });
  }

  onSearchSubmit(): void {
    const term = this.searchTerm.trim();
    if (!term) {
      this.fetchNotifications();
      return;
    }
    this.isSearching = true;
    this.isLoading = true;
    this.error = '';
    this.notificationService.search(term, { limit: 50 }).subscribe({
      next: (data) => {
        this.notifications = data.map((n) => this.toViewModel(n));
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.error = 'Search failed.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.isSearching = false;
    this.fetchNotifications();
  }

  getIconType(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('security') || t.includes('vulnerability')) return 'alert';
    if (t.includes('dependency') || t.includes('update')) return 'gitfork';
    if (t.includes('issue')) return 'bug';
    if (t.includes('pull_request') || t.includes('pr')) return 'gitpull';
    return 'notification';
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const notif = this.notifications.find((n) => n.id === id);
        if (notif) notif.isRead = true;
        this.refreshUnreadCount();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error marking as read:', err),
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach((n) => (n.isRead = true));
        this.unreadCount = 0;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error marking all as read:', err),
    });
  }

  dismiss(id: string): void {
    this.notificationService.delete(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter((n) => n.id !== id);
        this.selectedIds.delete(id);
        this.refreshUnreadCount();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to dismiss notification:', err),
    });
  }

  toggleSelect(id: string, event: Event): void {
    event.stopPropagation();
    if (this.selectedIds.has(id)) this.selectedIds.delete(id);
    else this.selectedIds.add(id);
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  clearSelection(): void {
    this.selectedIds.clear();
  }

  markSelectedAsRead(): void {
    const ids = Array.from(this.selectedIds);
    if (ids.length === 0) return;
    this.isBusy = true;
    this.notificationService.markMultipleAsRead(ids).subscribe({
      next: () => {
        this.notifications.forEach((n) => {
          if (this.selectedIds.has(n.id)) n.isRead = true;
        });
        this.clearSelection();
        this.refreshUnreadCount();
        this.isBusy = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to mark selected as read:', err);
        this.isBusy = false;
        this.cdr.markForCheck();
      },
    });
  }

  deleteSelected(): void {
    const ids = Array.from(this.selectedIds);
    if (ids.length === 0) return;
    if (!confirm(`Delete ${ids.length} selected notification${ids.length === 1 ? '' : 's'}? This cannot be undone.`)) return;

    this.isBusy = true;
    this.notificationService.deleteMultiple(ids).subscribe({
      next: () => {
        this.notifications = this.notifications.filter((n) => !this.selectedIds.has(n.id));
        this.clearSelection();
        this.refreshUnreadCount();
        this.isBusy = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to delete selected notifications:', err);
        this.isBusy = false;
        this.cdr.markForCheck();
      },
    });
  }

  clearAll(): void {
    if (this.notifications.length === 0) return;
    if (!confirm('Delete ALL of your notifications? This cannot be undone.')) return;

    this.isBusy = true;
    this.notificationService.deleteAll().subscribe({
      next: () => {
        this.notifications = [];
        this.selectedIds.clear();
        this.unreadCount = 0;
        this.isBusy = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to clear notifications:', err);
        this.isBusy = false;
        this.cdr.markForCheck();
      },
    });
  }

  cleanupOld(): void {
    if (!confirm('Delete notifications older than 30 days?')) return;

    this.isBusy = true;
    this.notificationService.cleanupOld(30).subscribe({
      next: (res) => {
        this.isBusy = false;
        this.fetchNotifications();
        this.refreshUnreadCount();
        this.cdr.markForCheck();
        alert(`Deleted ${res.deletedCount} old notification${res.deletedCount === 1 ? '' : 's'}.`);
      },
      error: (err) => {
        console.error('Cleanup failed:', err);
        this.isBusy = false;
        this.cdr.markForCheck();
      },
    });
  }
}

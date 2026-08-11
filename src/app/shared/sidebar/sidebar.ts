import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface MenuChild {
  label: string;
  path: string;
}

interface MenuItem {
  icon: string;
  label: string;
  path: string;
  separator: boolean;
  children?: MenuChild[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  @Input() isOpen = false;

  /**
   * Explicit expand/collapse choices the user has made, keyed by parent
   * path — absent means "follow the route" (auto-expand the group
   * containing the active child). A manual collapse has to stick even while
   * a child route is active, so this can't be a plain Set of "touched"
   * paths; it needs to carry the direction (open vs. closed), not just that
   * an override exists.
   */
  private readonly manualOverride = new Map<string, boolean>();

  private readonly baseMenuItems: MenuItem[] = [
    {
      icon: 'activity',
      label: 'Dashboard',
      path: '/dashboard',
      separator: false,
      children: [
        { label: 'Overview', path: '/dashboard' },
        { label: 'Repositories', path: '/dashboard/repositories' },
        { label: 'LeakGuard Scans', path: '/dashboard/leak-scans' },
      ],
    },
    {
      icon: 'chart',
      label: 'Package Health',
      path: '/repo-health',
      separator: true,
      children: [
        { label: 'Analyze', path: '/repo-health' },
        { label: 'Synced Scans', path: '/repo-health/synced-scans' },
      ],
    },
    { icon: 'user', label: 'User Profile', path: '/user-profile', separator: false },
    // Dashboard Settings is still a single page — it gains `children` once
    // its own subroutes exist (it's ~750 lines covering ~8 concerns with
    // shared org-switcher state, not a same-sitting split). Listing
    // children before those routes exist would ship dead sidebar links.
    { icon: 'settings', label: 'Dashboard Settings', path: '/dashboard-settings', separator: true },
    { icon: 'notification', label: 'Notifications', path: '/notifications', separator: false },
  ];

  // Hidden for everyone else — not a security boundary (the backend's
  // PlatformAdminGuard is), just avoids showing a link that would 403 for
  // non-admins.
  private readonly telemetryMenuItem: MenuItem = { icon: 'gauge', label: 'Usage Telemetry', path: '/telemetry', separator: true };

  /** Guest/marketing pages — the sidebar is the only mobile nav surface, so
      this is how a mobile user reaches them without logging out first. */
  readonly guestLinks = [
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Docs', path: '/docs' },
    { label: 'About', path: '/home', fragment: 'about' },
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  get menuItems(): MenuItem[] {
    return this.authService.currentState.isPlatformAdmin
      ? [...this.baseMenuItems, this.telemetryMenuItem]
      : this.baseMenuItems;
  }

  /**
   * A group is open if the user explicitly opened or closed it, or —
   * absent either — a child route is currently active. Called from the
   * template (not a memoized getter), so it's re-evaluated on every change
   * detection pass, including the router-triggered one after navigation —
   * no manual subscription needed to keep this in sync with the URL.
   */
  isExpanded(item: MenuItem): boolean {
    if (!item.children) return false;
    const override = this.manualOverride.get(item.path);
    return override !== undefined ? override : this.isGroupActive(item);
  }

  toggleExpand(item: MenuItem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.manualOverride.set(item.path, !this.isExpanded(item));
  }

  private isGroupActive(item: MenuItem): boolean {
    const url = this.router.url.split('?')[0].split('#')[0];
    return url === item.path || url.startsWith(item.path + '/');
  }

  closeMobileSidebar(): void {
    if (this.isOpen) {
      this.isOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.isOpen = false;
    this.router.navigate(['/home']);
  }
}

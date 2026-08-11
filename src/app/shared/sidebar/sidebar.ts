import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  @Input() isOpen = false;
  activeIndex: number | null = 0;

  private readonly baseMenuItems = [
    { icon: 'activity', label: 'Dashboard', path: '/dashboard', separator: false },
    { icon: 'chart', label: 'Package Health', path: '/repo-health', separator: true },
    { icon: 'user', label: 'User Profile', path: '/user-profile', separator: false },
    { icon: 'settings', label: 'Dashboard Settings', path: '/dashboard-settings', separator: true },
    { icon: 'notification', label: 'Notifications', path: '/notifications', separator: false },
  ];

  // Hidden for everyone else — not a security boundary (the backend's
  // PlatformAdminGuard is), just avoids showing a link that would 403 for
  // non-admins.
  private readonly telemetryMenuItem = { icon: 'gauge', label: 'Usage Telemetry', path: '/telemetry', separator: true };

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

  get menuItems() {
    return this.authService.currentState.isPlatformAdmin
      ? [...this.baseMenuItems, this.telemetryMenuItem]
      : this.baseMenuItems;
  }

  setActive(index: number) {
    this.activeIndex = index;
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

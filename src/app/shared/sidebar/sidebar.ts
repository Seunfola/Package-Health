import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
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
    { icon: 'home', label: 'Homepage', path: '/home', separator: false },
    { icon: 'activity', label: 'Dashboard', path: '/dashboard', separator: false },
    { icon: 'chart', label: 'Repository Health', path: '/repo-health', separator: true },
    { icon: 'info', label: 'Repository Details', path: '/repository-details', separator: true },
    { icon: 'user', label: 'User Profile', path: '/user-profile', separator: false },
    { icon: 'settings', label: 'Dashboard Settings', path: '/dashboard-settings', separator: true },
    { icon: 'notification', label: 'Notifications', path: '/notifications', separator: false },
  ];

  // Hidden for everyone else — not a security boundary (the backend's
  // PlatformAdminGuard is), just avoids showing a link that would 403 for
  // non-admins.
  private readonly telemetryMenuItem = { icon: 'gauge', label: 'Usage Telemetry', path: '/telemetry', separator: true };

  constructor(private readonly authService: AuthService) {}

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
}

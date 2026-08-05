import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';

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

  menuItems = [
    { icon: 'home', label: 'Homepage', path: '/home', separator: false },
    { icon: 'activity', label: 'Dashboard', path: '/dashboard', separator: false },
    { icon: 'chart', label: 'Repository Health', path: '/repo-health', separator: true },
    { icon: 'info', label: 'Repository Details', path: '/repository-details', separator: true },
    { icon: 'user', label: 'User Profile', path: '/user-profile', separator: false },
    { icon: 'settings', label: 'Dashboard Settings', path: '/dashboard-settings', separator: true },
    { icon: 'notification', label: 'Notifications', path: '/notifications', separator: false },
  ];

  setActive(index: number) {
    this.activeIndex = index;
    if (this.isOpen) {
      this.isOpen = false;
    }
  }
}

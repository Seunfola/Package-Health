import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva } from '../../../../styled-system/css';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  sidebar = cva({
    base: {
      display: 'flex',
      flexDirection: 'column',
      bg: 'sidebar.bg',
      height: '100vh',
      minWidth: '250px',
      padding: '24px',
      color: 'white',
    },
  });

  list = cva({
    base: {
      display: 'flex',
      flexDirection: 'column',
      listStyle: 'none',
      padding: 0,
      margin: 0,
      gap: '8px',
    },
  });

  listItem = cva({
    base: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      gap: '10px',
      cursor: 'pointer',
      borderRadius: 'md',
      fontWeight: 500,
      transition: 'background 0.2s, color 0.2s, border-left 0.2s',
      borderLeft: '4px solid transparent',
      _hover: { bg: 'sidebar.hover' },
    },
    variants: {
      active: {
        true: {
          fontWeight: 700,
          bg: 'primary.200',
          color: 'primary.700',
          borderLeft: '4px solid var(--colors-primary-700)',
        },
        false: {
          color: 'neutral.400',
        },
      },
    },
    defaultVariants: {
      active: false,
    },
  });

  activeIndex = 0;

  menuItems = [
    { icon: 'home', label: 'Homepage' },
    { icon: 'chart', label: 'Repository Health' },
    { icon: 'info', label: 'Repository Details' },
    { icon: 'user', label: 'User Profile' },
    { icon: 'settings', label: 'Dashboard Settings' },
    { icon: 'notification', label: 'Notifications' },
  ];

  setActive(index: number) {
    this.activeIndex = index;
  }
}

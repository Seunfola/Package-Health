import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva } from '../../../../styled-system/css';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  @Input() isOpen = false;
  activeIndex = 0;

  sidebar = cva({
    base: {
      display: 'flex',
      flexDirection: 'column',
      bg: 'sidebar.bg',
      color: 'white',
      height: 'calc(100vh - 64px)',
      width: { base: '65%', md: '360px' },
      position: { base: 'fixed', md: 'relative' },
      top: { base: '64px', md: '0' },
      left: { base: '-100%', md: '0' },
      zIndex: 30,
      padding: '24px',
      transition: 'left 0.3s ease-in-out',
      overflowY: 'auto',
    },
    variants: {
      open: {
        true: { left: '0' },
      },
    },
    defaultVariants: {
      open: false,
    },
  });

  overlay = cva({
    base: {
      display: { base: 'none', md: 'none' },
      position: 'fixed',
      top: '64px',
      left: 0,
      width: '100%',
      height: '100%',
      bg: 'rgba(0,0,0,0.4)',
      zIndex: 20,
      transition: 'opacity 0.3s ease',
    },
    variants: {
      show: {
        true: { display: 'block', opacity: 1 },
        false: { opacity: 0, display: 'none' },
      },
    },
    defaultVariants: { show: false },
  });

  list = cva({
    base: {
      display: 'flex',
      flexDirection: 'column',
      listStyle: 'none',
      padding: 0,
      margin: 0,
      gap: '10px',
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
      borderLeft: '4px solid transparent',
      transition: 'background 0.2s, color 0.2s, border-left 0.2s',
      color: '#BDC1CA',

      _hover: {
        bg: '#003F3F',
        color: '#00B3B3',
        borderLeft: '4px solid #00B3B3',
      },

      _focusVisible: {
        outline: '2px solid #007A7A',
        outlineOffset: '2px',
      },

      _active: {
        bg: '#005050',
        color: '#FFFFFF',
        borderLeft: '4px solid #007A7A',
      },
    },
    variants: {
      active: {
        true: {
          fontWeight: 700,
          bg: '#004444',
          color: '#fff',
          borderLeft: '4px solid #007A7A',
        },
      },
    },
    defaultVariants: { active: false },
  });

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

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../shared/navbar/navbar';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Footer } from '../shared/footer/footer';
import { css } from '../../../styled-system/css';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Sidebar, Footer],
  templateUrl: './layout.html',
})
export class Layout {
  // Add these two lines to fix the error
  public sidebarOpen: boolean = false;

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  layoutClass = css({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: 'gray.900',
    color: 'white',
  });

  mainWrapperClass = css({
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    height: 'calc(100vh - 64px)',
  });

  contentAreaClass = css({
    flexGrow: 1,
    overflowY: 'auto',
    padding: { base: '1rem', md: '2rem' },
    backgroundColor: 'gray.800',
  });
}

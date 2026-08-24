import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../shared/navbar/navbar';
import { Sidebar } from '../shared/sidebar/sidebar';

/**
 * The authenticated shell — fixed-height (see dashboard-layout.css's
 * `.layout { height: 100vh; overflow: hidden }`), sidebar/navbar pinned,
 * only `.content-area` scrolls. Deliberately has no `<app-footer>`: that's
 * PublicLayout's marketing footer (newsletter signup, product/resources
 * link columns) and was previously included here too — a copy-paste
 * leftover from PublicLayout's near-identical shell markup, not an
 * intentional design decision. A logged-in user looking at their dashboard
 * doesn't need a "subscribe to our newsletter" form, and the mismatch with
 * the fixed-height shell meant it only became visible via `overflow`
 * quirks rather than by design.
 */
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  public sidebarOpen: boolean = false;

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

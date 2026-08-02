import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../shared/navbar/navbar';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Footer } from '../shared/footer/footer';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Sidebar, Footer],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  public sidebarOpen: boolean = true;

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

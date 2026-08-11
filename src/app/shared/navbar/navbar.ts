import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@/app/services/auth.service';
import { AuthLogin } from '@/app/services/auth-login.component';
import { OrganizationService } from '@/app/services/organization.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule, AuthLogin],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  showSearch = false;
  showUserMenu = false;

  authState$;

  /** PAID-org branding — the first org (owned or member of) that has a custom logo set, shown alongside the DepVault logo. */
  orgLogoUrl: string | null = null;

  // New state variable to control modal visibility
  showLoginModal: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly organizationService: OrganizationService,
    private readonly router: Router,
  ) {
    this.authState$ = this.authService.authState$;
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) return;
    this.organizationService.listMyOrganizations().subscribe({
      next: (orgs) => {
        this.orgLogoUrl = orgs.find((o) => o.logoUrl)?.logoUrl ?? null;
      },
      error: () => {
        // Branding is cosmetic — silently skip if this fails, never block the navbar on it.
      },
    });
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/home']);
  }

  // Method to show the modal when the icon is clicked
  openLoginModal() {
    this.showLoginModal = true;
  }

  // Method to close the modal (used via event binding from the modal itself)
  closeLoginModal() {
    this.showLoginModal = false;
  }
}

import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthLogin } from '@/app/services/auth-login.component';
import { AuthService } from '@/app/services/auth.service';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule, AuthLogin],
  templateUrl: './public-navbar.html',
  styleUrls: ['./public-navbar.css'],
})
export class PublicNavbar {
  showLoginModal = false;
  showMobileMenu = false;
  showUserMenu = false;

  authState$;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.authState$ = this.authService.authState$;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  openLoginModal(): void {
    this.showMobileMenu = false;
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
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
    this.showMobileMenu = false;
    this.router.navigate(['/home']);
  }
}

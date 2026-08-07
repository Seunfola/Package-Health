import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthLogin } from '@/app/services/auth-login.component';

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
}

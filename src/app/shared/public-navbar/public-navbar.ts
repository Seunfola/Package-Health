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

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }
}

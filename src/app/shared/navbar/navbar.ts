import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from '@/app/services/auth';
import { LoginCard } from '../login-card/login-card';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, LoginCard],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  @Output() toggleSidebar = new EventEmitter<void>();
  showSearch = false;
  isLoggedIn: boolean = false;
  userProfileImage: string = '';

  // New state variable to control modal visibility
  showLoginModal: boolean = false;

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.userProfileImage = 'path/to/user/image.jpg';
    }
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
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

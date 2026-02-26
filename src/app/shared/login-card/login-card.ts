import { AuthService } from '@/app/services/auth';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.html',
  styleUrls: ['./login-card.css'],
})
export class LoginCard {
  constructor(private authService: AuthService) {}

  loginWithGithub(): void {
    this.authService.loginWithGithub();
  }
}

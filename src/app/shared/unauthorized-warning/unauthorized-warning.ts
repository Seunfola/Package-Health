import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLogin } from '@/app/services/auth-login.component';

@Component({
  selector: 'app-unauthorized-warning',
  standalone: true,
  imports: [CommonModule, AuthLogin],
  templateUrl: './unauthorized-warning.html',
  styleUrl: './unauthorized-warning.css'
})
export class UnauthorizedWarning {}

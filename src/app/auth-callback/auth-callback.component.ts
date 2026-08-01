import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `<div class="flex items-center justify-center min-h-[60vh]">
               <div class="text-xl font-semibold">Authenticating... Please wait.</div>
             </div>`
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      const token = params['token'];
      if (token) {
        // Save the token and redirect to dashboard
        await this.authService.setJwtToken(token);
        this.router.navigate(['/dashboard']);
      } else {
        // Handle missing token, maybe redirect to an error page or login
        console.error('Authentication failed: No token received.');
        this.router.navigate(['/home']);
      }
    });
  }
}


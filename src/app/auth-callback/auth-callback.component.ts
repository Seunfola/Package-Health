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
      const code = params['code'];
      if (!code) {
        // Handle missing code, maybe redirect to an error page or login
        console.error('Authentication failed: No code received.');
        this.router.navigate(['/home']);
        return;
      }

      // The callback URL only ever carries a one-time code, never the JWT
      // itself — exchange it server-side for the real token.
      const token = await this.authService.exchangeCode(code);
      if (token) {
        await this.authService.setJwtToken(token);
        this.router.navigate(['/dashboard']);
      } else {
        console.error('Authentication failed: code exchange failed.');
        this.router.navigate(['/home']);
      }
    });
  }
}


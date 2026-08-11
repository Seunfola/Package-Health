import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { OrganizationService } from '../services/organization.service';
import { PENDING_INVITE_TOKEN_KEY } from '../accept-invite/accept-invite.component';
import { PENDING_TRANSFER_KEY } from '../accept-transfer/accept-transfer.component';

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
    private authService: AuthService,
    private organizationService: OrganizationService,
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
        await this.finishPendingInviteIfAny();
        await this.finishPendingTransferIfAny();
        const destination = this.authService.currentState.onboardingCompleted === false ? '/onboarding' : '/dashboard';
        this.router.navigate([destination]);
      } else {
        console.error('Authentication failed: code exchange failed.');
        this.router.navigate(['/home']);
      }
    });
  }

  /**
   * If the user landed on /accept-invite while signed out, the invite token
   * was stashed in sessionStorage before the GitHub/Google redirect (which
   * reloads the whole SPA, losing any in-memory state) — resume acceptance
   * now that they have a real session, so they don't have to click the
   * invite link a second time after signing in.
   */
  private async finishPendingInviteIfAny(): Promise<void> {
    const pendingToken = sessionStorage.getItem(PENDING_INVITE_TOKEN_KEY);
    if (!pendingToken) return;

    sessionStorage.removeItem(PENDING_INVITE_TOKEN_KEY);
    try {
      await firstValueFrom(this.organizationService.acceptInvitation(pendingToken));
    } catch (error) {
      console.error('Failed to accept pending invitation after sign-in', error);
    }
  }

  /**
   * Same idea as finishPendingInviteIfAny(), for the /accept-transfer flow:
   * the orgId+token pair is stashed before the OAuth redirect and resumed
   * here once a real session exists.
   */
  private async finishPendingTransferIfAny(): Promise<void> {
    const raw = sessionStorage.getItem(PENDING_TRANSFER_KEY);
    if (!raw) return;

    sessionStorage.removeItem(PENDING_TRANSFER_KEY);
    try {
      const { orgId, token } = JSON.parse(raw) as { orgId: string; token: string };
      await firstValueFrom(this.organizationService.acceptTransfer(orgId, { transferToken: token }));
    } catch (error) {
      console.error('Failed to accept pending ownership transfer after sign-in', error);
    }
  }
}


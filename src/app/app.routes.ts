import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/dashboard-layout';
import { PublicLayout } from './layout/public-layout';
import { Homepage } from './homepage/homepage';
import { RepoHealth } from './repo-health/repo-health';
import { SyncedScans } from './repo-health/synced-scans/synced-scans';
import { RepoDetails } from './repo-details/repo-details';
import { DashboardSettings } from './dashboard-settings/dashboard-settings';
import { OrganizationSettings } from './dashboard-settings/organization/organization';
import { MembersSettings } from './dashboard-settings/members/members';
import { TokensSettings } from './dashboard-settings/tokens/tokens';
import { GatekeeperSettings } from './dashboard-settings/gatekeeper/gatekeeper';
import { WebhooksSettings } from './dashboard-settings/webhooks/webhooks';
import { Notification } from './notification/notification';
import { UserProfile } from './user-profile/user-profile';
import { PrivacyPolicy } from './legal/privacy/privacy';
import { TermsOfService } from './legal/terms/terms';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { AcceptInviteComponent } from './accept-invite/accept-invite.component';
import { AcceptTransferComponent } from './accept-transfer/accept-transfer.component';
import { DocsPage } from './docs/docs';
import { PricingPage } from './pricing/pricing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRepositories } from './dashboard/repositories/repositories';
import { DashboardLeakScans } from './dashboard/leak-scans/leak-scans';
import { TelemetryDashboard } from './telemetry/telemetry-dashboard';
import { NotFound } from './not-found/not-found';
import { GetStartedPage } from './get-started/get-started';
import { FeaturesPage } from './features/features';
import { NewsletterPage } from './newsletter/newsletter';
import { HowItWorksPage } from './how-it-works/how-it-works';
import { authGuard } from './services/auth.guard';
import { onboardingGuard } from './services/onboarding.guard';
import { OnboardingWizard } from './onboarding/onboarding';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Homepage },
      { path: 'docs', component: DocsPage },
      { path: 'pricing', component: PricingPage },
      { path: 'get-started', component: GetStartedPage },
      { path: 'features', component: FeaturesPage },
      { path: 'how-it-works', component: HowItWorksPage },
      { path: 'newsletter', component: NewsletterPage },
      { path: 'privacy', component: PrivacyPolicy },
      { path: 'terms', component: TermsOfService },
      { path: 'auth/callback', component: AuthCallbackComponent },
      { path: 'accept-invite', component: AcceptInviteComponent },
      { path: 'accept-transfer', component: AcceptTransferComponent },
    ],
  },
  {
    // Authenticated but deliberately outside DashboardLayout — the wizard
    // owns its own full-bleed chrome, not the sidebar/navbar shell, and a
    // not-yet-onboarded user must be able to reach it even though
    // onboardingGuard blocks every DashboardLayout route below.
    path: 'onboarding',
    component: OnboardingWizard,
    canActivate: [authGuard],
  },
  {
    path: '',
    component: DashboardLayout,
    // Guards every child route below — previously authGuard existed but was
    // never wired in, so /dashboard, /notifications, /user-profile etc. were
    // reachable by direct URL with no client-side auth check at all (the
    // backend still rejected the underlying API calls, but the route itself
    // rendered before any of those calls failed). onboardingGuard runs after
    // authGuard so it only ever evaluates for an already-authenticated user.
    canActivate: [authGuard, onboardingGuard],
    children: [
      // More specific paths must come before the shorter 'dashboard' prefix
      // they share — Angular's router matches route config in declaration
      // order and picks the first path-segment match, so if 'dashboard'
      // (no children) were listed first it would claim the first segment
      // and leave 'repositories'/'leak-scans' unresolved instead of trying
      // the next sibling, producing a 404 despite a route existing for it.
      { path: 'dashboard/repositories', component: DashboardRepositories },
      { path: 'dashboard/leak-scans', component: DashboardLeakScans },
      { path: 'dashboard', component: DashboardComponent },
      // 'synced-scans' must precede the plain 'repo-health' route — see the
      // dashboard/repositories comment above for why route order matters
      // for a shorter sibling with no children of its own.
      { path: 'repo-health/synced-scans', component: SyncedScans },
      { path: 'repo-health', component: RepoHealth },
      { path: 'repository-details/:owner/:name', component: RepoDetails },
      { path: 'repository-details', component: RepoDetails, data: { deadEnd: true } },
      // Specific subroutes before the plain 'dashboard-settings' prefix —
      // same reason as the dashboard/repo-health comments above.
      { path: 'dashboard-settings/organization', component: OrganizationSettings },
      { path: 'dashboard-settings/members', component: MembersSettings },
      { path: 'dashboard-settings/tokens', component: TokensSettings },
      { path: 'dashboard-settings/gatekeeper', component: GatekeeperSettings },
      { path: 'dashboard-settings/webhooks', component: WebhooksSettings },
      { path: 'dashboard-settings', component: DashboardSettings },
      { path: 'notifications', component: Notification },
      { path: 'user-profile', component: UserProfile },
      { path: 'telemetry', component: TelemetryDashboard },
    ],
  },
  { path: '404', component: NotFound },
  { path: '**', component: NotFound }
];

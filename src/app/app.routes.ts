import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/dashboard-layout';
import { PublicLayout } from './layout/public-layout';
import { Homepage } from './homepage/homepage';
import { RepoHealth } from './repo-health/repo-health';
import { RepoDetails } from './repo-details/repo-details';
import { DashboardSettings } from './dashboard-settings/dashboard-settings';
import { Notification } from './notification/notification';
import { UserProfile } from './user-profile/user-profile';
import { PrivacyPolicy } from './legal/privacy/privacy';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Homepage },
      { path: 'privacy', component: PrivacyPolicy },
      { path: 'auth/callback', component: AuthCallbackComponent },
    ],
  },
  {
    path: '',
    component: DashboardLayout,
    // Guards every child route below — previously authGuard existed but was
    // never wired in, so /dashboard, /notifications, /user-profile etc. were
    // reachable by direct URL with no client-side auth check at all (the
    // backend still rejected the underlying API calls, but the route itself
    // rendered before any of those calls failed).
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'repo-health', component: RepoHealth },
      { path: 'repository-details/:owner/:name', component: RepoDetails },
      { path: 'repository-details', component: RepoDetails },
      { path: 'dashboard-settings', component: DashboardSettings },
      { path: 'notifications', component: Notification },
      { path: 'user-profile', component: UserProfile },
    ],
  },
  { path: '**', redirectTo: '' }
];

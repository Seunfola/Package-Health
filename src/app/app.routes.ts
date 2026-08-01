import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Homepage } from './homepage/homepage';
import { RepoHealth } from './repo-health/repo-health';
import { RepoDetails } from './repo-details/repo-details';
import { DashboardSettings } from './dashboard-settings/dashboard-settings';
import { Notification } from './notification/notification';
import { UserProfile } from './user-profile/user-profile';
import { PrivacyPolicy } from './legal/privacy/privacy';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Homepage },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'repo-health', component: RepoHealth },
      { path: 'repository-details/:owner/:name', component: RepoDetails },
      { path: 'repository-details', component: RepoDetails },
      { path: 'dashboard-settings', component: DashboardSettings },
      { path: 'notifications', component: Notification },
      { path: 'user-profile', component: UserProfile },
      { path: 'privacy', component: PrivacyPolicy },
      { path: 'auth/callback', component: AuthCallbackComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

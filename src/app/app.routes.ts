import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Homepage } from './homepage/homepage';
import { RepoHealth } from './repo-health/repo-health';
import { RepoDetails } from './repo-details/repo-details';
import { DashboardSettings } from './dashboard-settings/dashboard-settings';
import { Notification } from './notification/notification';


export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Homepage },
      { path: 'repo-health', component: RepoHealth },
      { path: 'repository-details', component: RepoDetails },
      { path: 'dashboard-settings', component: DashboardSettings },
      { path: 'notifications', component: Notification },
    ],
  },
];

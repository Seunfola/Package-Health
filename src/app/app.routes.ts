import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Homepage } from './homepage/homepage';
import { AboutUs } from './about-us/about-us';
import { RepoHealth } from './repo-health/repo-health';


export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Homepage },
      { path: 'about', component: AboutUs },
      { path: 'repo-health', component: RepoHealth },
      // { path: 'repository-details', component: RepoDetailsComponent },
    ],
  },
];

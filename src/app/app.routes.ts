import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Homepage } from './homepage/homepage';
import { AboutUs } from './about-us/about-us';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Homepage },
      { path: 'about', component: AboutUs },
    ],
  },
];

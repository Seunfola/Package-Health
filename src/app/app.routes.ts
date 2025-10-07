import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Homepage } from './homepage/homepage';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Homepage }, 
    ],
  },
];

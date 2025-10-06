import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { AboutUs } from './about-us/about-us';
import { Layout } from './layout/layout';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes), Layout, Homepage, AboutUs],
  exports: [RouterModule],
})
export class AppRoutingModule {}

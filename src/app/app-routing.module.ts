import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUs } from './about-us/about-us';

const routes: Routes = [
  { path: 'about-us', component: AboutUs },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

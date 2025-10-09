import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageHealthCard } from '@/app/reusable/package-health-card/package-health-card';
import { Updates } from './updates';


@NgModule({
  declarations: [],
  imports: [CommonModule, PackageHealthCard, Updates],
})
export class UpdatesModule {}

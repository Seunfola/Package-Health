import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageHealthCard } from '../package-health-card/package-health-card';
import { InsightCard } from '../insight-card/insight-card';

@NgModule({
  declarations: [],
  imports: [CommonModule, PackageHealthCard, InsightCard],
  exports: [PackageHealthCard, InsightCard],
})
export class SharedModule {}

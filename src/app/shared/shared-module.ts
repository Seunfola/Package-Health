import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageHealthCard } from '../reusable/package-health-card/package-health-card';
import { InsightCard } from '../reusable/insight-card/insight-card';
import { StatusCard } from '../reusable/status-card/status-card';


@NgModule({
  declarations: [],
  imports: [CommonModule, PackageHealthCard, InsightCard, StatusCard],
  exports: [PackageHealthCard, InsightCard, StatusCard],
})
export class SharedModule {}

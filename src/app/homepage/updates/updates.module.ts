import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Updates } from './updates';
import { PackageHealthCard } from '../../reusable/package-health-card/package-health-card';


@NgModule({
  declarations: [],
  imports: [CommonModule, PackageHealthCard, Updates],
})
export class UpdatesModule {}

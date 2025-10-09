import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Homepage } from './homepage';
import { UpdatesModule } from './updates/updates.module';
import { SharedModule } from '../shared/shared-module';
import { FeatureSectionModule } from './feature-section/feature-section.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, UpdatesModule, SharedModule, Homepage, FeatureSectionModule],
})
export class HomepageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsightCard } from '../../insight-card/insight-card';
import { FeatureSection } from './feature-section';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InsightCard, 
    FeatureSection,
  ],
  exports: [
    FeatureSection,
  ],
})
export class FeatureSectionModule {}

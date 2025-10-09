import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureSection } from './feature-section';
import { InsightCard } from '../../reusable/insight-card/insight-card';

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

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CodeMetricItem } from './code-metric-item/code-metric-item';

export interface HealthMetrics {
  security: number;
  performance: number;
  reliability: number;
  maintainability: number;
}

@Component({
  selector: 'app-code-quality-metrics',
  standalone: true,
  imports: [CommonModule, CodeMetricItem],
  templateUrl: './code-quality-metrics.html',
  styleUrl: './code-quality-metrics.css',
})
export class CodeQualityMetrics {
  // Backend-computed values (RepoHealthCalculator, @depvault/core) — no
  // local defaults, since DepVault doesn't run test suites or static
  // analysis, so there's no honest fallback number to show when this
  // input is absent. The template renders an empty state instead.
  @Input() healthMetrics?: HealthMetrics;

  get maintainability() {
    return {
      percentage: this.healthMetrics?.maintainability ?? 0,
      title: 'Maintainability',
      iconPath: 'assets/icons/gauge.svg',
    };
  }

  get reliability() {
    return {
      percentage: this.healthMetrics?.reliability ?? 0,
      title: 'Reliability',
      iconPath: 'assets/icons/test-tube.svg',
    };
  }
}

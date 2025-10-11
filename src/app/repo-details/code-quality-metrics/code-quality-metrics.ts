import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CodeMetricItem } from './code-metric-item/code-metric-item';

@Component({
  selector: 'app-code-quality-metrics',
  standalone: true,
  imports: [CommonModule, CodeMetricItem],
  templateUrl: './code-quality-metrics.html',
  styleUrl: './code-quality-metrics.css',
})
export class CodeQualityMetrics {
  maintainability = {
    percentage: 85,
    title: 'Maintainability',
    iconPath: 'assets/icons/gauge.svg',
  };

  testCoverage = {
    percentage: 92,
    title: 'Test Coverage',
    iconPath: 'assets/icons/test-tube.svg',
  };
}
